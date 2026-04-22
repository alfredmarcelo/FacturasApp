from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel, Field
import datetime

from Basededatos import get_db, AD, cotizaciones
from JWT import ValidarToken

route = APIRouter()


# -----------------------------
#   VALIDACIONES Y MODELOS
# -----------------------------

class ProductoCotizacion(BaseModel):
    descripcion: str
    cantidad: int = Field(ge=1)
    precio: float = Field(ge=0)


from typing import Any

class CrearCotizacion(BaseModel):
    ad_id: Any
    nombre: Any
    fecha: Any
    fecha_validez: Any
    rnc_cliente: Any
    subtotal: Any
    descuento: Any
    itbis: Any
    total: Any
    estado: Any


# -----------------------------
#   FUNCIONES AUXILIARES
# -----------------------------

def obtener_admin_id(token, db):
    token_validado = ValidarToken(token)
    if not token_validado:
        raise HTTPException(400, "Token inválido")

    admin = db.query(AD).filter(AD.correo == token_validado["correo"]).first()

    if not admin:
        raise HTTPException(404, "Administrador no encontrado")

    return admin.id


# -----------------------------
#     RUTA: CREAR COTIZACIÓN
# -----------------------------

@route.post('/crearCotizacion/')
async def CrearCotizacionRoute(
    data: CrearCotizacion,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    print(data)

    meses = {
        "ene": "01", "feb": "02", "mar": "03", "abr": "04",
        "may": "05", "jun": "06", "jul": "07", "ago": "08",
        "sep": "09", "oct": "10", "nov": "11",
        "dic": "12"
    }

    # Ejemplo: "4 dic 2025"
    fecha = data.fecha.replace(".", "").strip()
    dia, mes_txt, año = fecha.split()
    mes = meses[mes_txt.lower()]

    fecha_iso = f"{año}-{mes}-{dia.zfill(2)}"
    dt = datetime.datetime.strptime(fecha_iso, "%Y-%m-%d")

    if data.fecha_validez.isdigit():
        fecha_limite = dt + datetime.timedelta(days=int(data.fecha_validez))
    else:
        raise HTTPException(status_code=400, detail="fecha_vencimiento debe ser un número de días")


    # 1. Validar token
    token = authorization.split(' ')[1]
    admin_id = obtener_admin_id(token, db)

    # 3. Guardar cotización
    nueva_cotizacion = cotizaciones(
        ad_id=data.ad_id,
        nombre=data.nombre,
        fecha=dt,
        fecha_validez=fecha_limite,
        rnc_cliente=data.rnc_cliente,
        subtotal=data.subtotal,
        descuento=data.descuento,
        itbis=data.itbis,
        total=data.total,
        estado=data.estado
    )

    db.add(nueva_cotizacion)
    db.commit()
    db.refresh(nueva_cotizacion)

    return {
        "mensaje": "Cotización creada correctamente",
        "id": nueva_cotizacion.id,
        "ad_id": nueva_cotizacion.ad_id,
        "nombre": nueva_cotizacion.nombre,
        "fecha": nueva_cotizacion.fecha,
        "fecha_validez": nueva_cotizacion.fecha_validez,
        "rnc_cliente": nueva_cotizacion.rnc_cliente,
        "subtotal": nueva_cotizacion.subtotal,
        "descuento": nueva_cotizacion.descuento,
        "itbis": nueva_cotizacion.itbis,
        "total": nueva_cotizacion.total,
        "estado": nueva_cotizacion.estado
    }


# -----------------------------
#   RUTA: OBTENER COTIZACIONES
# -----------------------------

@route.get('/obtenerCotizaciones/')
async def ObtenerCotizaciones(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):

    token = authorization.split(' ')[1]
    admin_id = obtener_admin_id(token, db)

    obtener = db.query(cotizaciones).filter(cotizaciones.ad_id == admin_id).all()

    return {
        "cantidad": len(obtener),
        "obtener_cotizaciones": [
            {
                "id": c.id,
                "fecha": c.fecha,
                "fecha_validez": c.fecha_validez,
                "total": float(c.total),
                "estado": c.estado,
            }
            for c in obtener
        ]
    }
