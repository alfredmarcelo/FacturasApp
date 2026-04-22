from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
import datetime

from Basededatos import get_db, Clientes, AD, negocio, facturas
from JWT import ValidarToken


route = APIRouter()


# ============================================================
# MODELOS Pydantic
# ============================================================

class ClienteCreate(BaseModel):
    nombre: str
    cedula_rnc: str
    telefono: str
    email: str
    direccion: str
    tipo_cliente: str
    token: str
    ad_id: str


class ClienteID(BaseModel):
    id: int


class FacturaID(BaseModel):
    id: int


class Comprobante(BaseModel):
    comprobante: str

class AgregarFactura(BaseModel):
    cliente_id: str
    ncf: str
    tipo_ncf: str    
    fecha_factura: str
    fecha_vencimiento: str
    subtotal: float
    descuento: float
    itbis: float
    total: float
    forma_pago: str
    estado: str
    ad_id: str

# ============================================================
# FUNCIONES DE UTILIDAD
# ============================================================


@route.post('/CrearFactura/')
async def crear_factura(data: AgregarFactura, authorization: str = Header(None), db: Session = Depends(get_db)):

    negocio_admin = await validar_header_negocio(authorization, db)
    if not negocio_admin:
        raise HTTPException(404)

    # ----------------------------
    # 1. PARSEAR FECHA FACTURA
    # ----------------------------
    meses = {
        "ene": "01", "feb": "02", "mar": "03", "abr": "04",
        "may": "05", "jun": "06", "jul": "07", "ago": "08",
        "sep": "09", "oct": "10", "nov": "11",
        "dic": "12"
    }

    # Ejemplo: "4 dic 2025"
    fecha = data.fecha_factura.replace(".", "").strip()
    dia, mes_txt, año = fecha.split()
    mes = meses[mes_txt.lower()]

    fecha_iso = f"{año}-{mes}-{dia.zfill(2)}"
    dt = datetime.datetime.strptime(fecha_iso, "%Y-%m-%d")

    # ----------------------------
    # 2. CALCULAR FECHA DE VENCIMIENTO
    # ----------------------------
    if data.fecha_vencimiento.isdigit():
        fecha_limite = dt + datetime.timedelta(days=int(data.fecha_vencimiento))
    else:
        raise HTTPException(status_code=400, detail="fecha_vencimiento debe ser un número de días")

    # ----------------------------
    # 3. GUARDAR FACTURA
    # ----------------------------
    nuevo_factura = facturas(
        ncf=data.ncf,
        tipo_ncf=data.tipo_ncf,
        fecha=dt,
        fecha_vencimiento=fecha_limite,
        subtotal=data.subtotal,
        descuento=data.descuento,
        itbis=data.itbis,
        total=data.total,
        cliente_id=data.cliente_id,
        forma_pago=data.forma_pago,
        estado=data.estado,
        negocio_id=negocio_admin,
        ad_id=data.ad_id
    )

    db.add(nuevo_factura)
    db.commit()
    db.refresh(nuevo_factura)

    return {"message": "Factura agregada correctamente", "factura_id": nuevo_factura.id}


def obtener_admin_id(token: str, db: Session):
    token_validado = ValidarToken(token)
    if not token_validado:
        raise HTTPException(400, "Token inválido")

    admin = db.query(AD).filter(AD.correo == token_validado["correo"]).first()

    if not admin:
        raise HTTPException(404, "Administrador no encontrado")

    return admin.id


def obtener_negocio(token: str, db: Session):
    admin_id = obtener_admin_id(token, db)
    negocio_encontrado = db.query(negocio).filter(negocio.AD_id == admin_id).first()

    if not negocio_encontrado:
        raise HTTPException(404, "El administrador no tiene un negocio asignado")

    return negocio_encontrado


async def validar_header_negocio(authorization: str, db: Session):
    if not authorization:
        raise HTTPException(400, "Falta el token en el header")

    try:
        token = authorization.split(" ")[1]
    except:
        raise HTTPException(400, "Formato de token inválido")

    ValidarToken(token) or (_ for _ in ()).throw(HTTPException(401, "Token inválido"))

    negocio_admin = obtener_negocio(token, db)
    return negocio_admin.id


# ============================================================
# ENDPOINTS
# ============================================================

@route.post('/Clientes/')
def crear_cliente(data: ClienteCreate, db: Session = Depends(get_db)):

    negocio_admin = obtener_negocio(data.token, db)

    # Validar duplicados
    cliente_existente = db.query(Clientes).filter(
        Clientes.negocio_id == negocio_admin.id,
        (
            (Clientes.cedula_rnc == data.cedula_rnc) |
            (Clientes.email == data.email) |
            (Clientes.telefono == data.telefono)
        )
    ).first()

    if cliente_existente:
        raise HTTPException(400, "Ya existe un cliente con este RNC, correo o teléfono")

    nuevo_cliente = Clientes(
        nombre=data.nombre,
        cedula_rnc=data.cedula_rnc,
        telefono=data.telefono,
        email=data.email,
        direccion=data.direccion,
        tipo_cliente=data.tipo_cliente,
        negocio_id=negocio_admin.id,
        ad_id = data.ad_id
    )

    db.add(nuevo_cliente)
    db.commit()
    db.refresh(nuevo_cliente)

    return {"message": "Cliente creado correctamente", "cliente_id": nuevo_cliente.id}


@route.get('/GetClientes/')
async def obtener_clientes(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    negocio_admin = await validar_header_negocio(authorization, db)

    clientes = db.query(Clientes).filter(
        Clientes.negocio_id == negocio_admin
    ).all()

    return {
        "cantidad": len(clientes),
        "clientes": [
            {
                "id": cli.id,
                "nombre": cli.nombre,
                "cedula_rnc": cli.cedula_rnc,
                "telefono": cli.telefono,
                "email": cli.email,
                "direccion": cli.direccion,
                "tipo_cliente": cli.tipo_cliente,
                "status": cli.status,
                "total_facturas": db.query(facturas).filter(
                    facturas.cliente_id == cli.id
                ).count()
            }
            for cli in clientes
        ]
    }


@route.get('/ObtenerClientesOrganizado/')
async def obtener_clientes_organizados(db: Session = Depends(get_db)):

    query = text("""
        WITH compras AS (
            SELECT 
                cliente_id,
                fecha,
                LAG(fecha) OVER (PARTITION BY cliente_id ORDER BY fecha) AS fecha_anterior
            FROM facturas
        ),
        promedios AS (
            SELECT
                cliente_id,
                AVG(EXTRACT(EPOCH FROM (fecha - fecha_anterior)) / 86400) AS dias_promedio
            FROM compras
            WHERE fecha_anterior IS NOT NULL
            GROUP BY cliente_id
        )
        SELECT 
            c.id,
            c.nombre,
            c.cedula_rnc,
            c.telefono,
            c.email,
            c.direccion,
            c.tipo_cliente,
            c.status,
            COUNT(f.id) AS cantidad_facturas,
            COALESCE(SUM(f.total), 0) AS total_facturado,
            MAX(f.fecha) AS ultima_compra,
            COALESCE(p.dias_promedio, NULL) AS dias_promedio,
            CASE 
                WHEN p.dias_promedio IS NULL OR p.dias_promedio = 0 THEN 50
                ELSE LEAST(2.0, 30.0 / NULLIF(p.dias_promedio, 0)) * 100
            END AS score_frecuencia
        FROM clientes c
        LEFT JOIN facturas f ON f.cliente_id = c.id
        LEFT JOIN promedios p ON p.cliente_id = c.id
        GROUP BY c.id, p.dias_promedio
        ORDER BY score_frecuencia DESC;
    """)

    res = db.execute(query).fetchall()

    return {
        "clientes": [
            {
                "id": r.id,
                "nombre": r.nombre,
                "cedula_rnc": r.cedula_rnc,
                "telefono": r.telefono,
                "email": r.email,
                "direccion": r.direccion,
                "tipo_cliente": r.tipo_cliente,
                "status": r.status,
                "cantidad_facturas": r.cantidad_facturas,
                "total_facturado": float(r.total_facturado),
                "ultima_compra": r.ultima_compra,
                "dias_promedio": float(r.dias_promedio) if r.dias_promedio else None,
                "score_frecuencia": float(r.score_frecuencia)
            }
            for r in res
        ]
    }

@route.post('/Facturas/')
async def obtener_facturas_cliente(
    data: ClienteID,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    negocio_admin = await validar_header_negocio(authorization, db)

    cliente_encontrado = db.query(Clientes).filter(
        Clientes.id == data.id,
        Clientes.negocio_id == negocio_admin
    ).first()

    if not cliente_encontrado:
        raise HTTPException(404, "Cliente no encontrado")

    facturas_cliente = db.query(facturas).filter(
        facturas.cliente_id == cliente_encontrado.id
    ).all()

    return {
        "cantidad": len(facturas_cliente),
        "factura": [
            {
                "id": fac.id,
                "ncf": fac.ncf,
                "fecha": fac.fecha,
                "subtotal": fac.subtotal,
                "total": fac.total,
                "itbis": fac.itbis,
                "descuento": fac.descuento,
                "fecha_factura": fac.fecha
            }
            for fac in facturas_cliente
        ]
    }


@route.get('/ObtenerTodasFacturas/')
async def obtener_facturas_negocio(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    negocio_admin = await validar_header_negocio(authorization, db)

    facturas_neg = db.query(facturas).filter(
        facturas.negocio_id == negocio_admin
    ).all()

    return {
        "cantidad": len(facturas_neg),
        "facturas": [
            {
                "id": fac.id,
                "cliente_id": fac.cliente_id,
                "ncf": fac.ncf,
                "fecha": fac.fecha,
                "subtotal": fac.subtotal,
                "total": fac.total,
                "itbis": fac.itbis,
                "descuento": fac.descuento,
                "fecha_factura": fac.fecha_factura
            }
            for fac in facturas_neg
        ]
    }


@route.post('/comprobante/')
async def obtener_ncf(
    data: Comprobante,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    negocio_admin = await validar_header_negocio(authorization, db)

    query = text(f"""
        SELECT MAX(ncf)
        FROM facturas
        WHERE negocio_id = '{negocio_admin}'
        AND ncf ILIKE '{data.comprobante}%'
    """)

    res = db.execute(query).scalar()

    if not res:
        nuevo_ncf = f"{data.comprobante}0000001"
    else:
        letra = res[:1]
        numero = int(res[1:]) + 1
        nuevo_ncf = f"{letra}{numero:09d}"

    return {"ncf": nuevo_ncf}


@route.delete('/EliminarFactura/{factura_id}')
async def eliminar_factura(
    factura_id: int,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    negocio_admin = await validar_header_negocio(authorization, db)

    factura_encontrada = db.query(facturas).filter(
        facturas.id == factura_id,
        facturas.negocio_id == negocio_admin
    ).first()

    if not factura_encontrada:
        raise HTTPException(404, "Factura no encontrada")

    db.delete(factura_encontrada)
    db.commit()

    return {"message": "Factura eliminada correctamente", "factura_id": factura_id}
