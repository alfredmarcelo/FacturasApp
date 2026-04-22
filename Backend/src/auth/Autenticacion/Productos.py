from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
from Basededatos import get_db, productos, AD, negocio
from HashPassword import Hashear_Password
from JWT import CrearToken, ValidarToken
from Qdrant_basededatos import Crear_collecion


route = APIRouter()


class producto(BaseModel):
    ad_id: int
    nombre: str
    precio: float
    precio_por_mayor: float
    itbis: float
    descuento: float
    tipo_producto: str
    codigo_barras: str | None = None
    tiene_itbis: bool
    activo: bool

def verificar_existencia_producto(producto, db):
    existe = db.query(productos).filter(productos.codigo == producto.codigo_barras).first()
    if existe:
        raise HTTPException(400, "El producto ya existe")
    return True


def Obtener_negocio(token, db):
    tokenvalidado = ValidarToken(token)
    if not tokenvalidado:
        raise HTTPException(400, "Token inválido")

    admin = db.query(AD).filter(AD.correo == tokenvalidado['correo']).first()
    if not admin:
        raise HTTPException(404, "Administrador no encontrado")

    return admin.id


def Obtener_Negocio(token, db):
    admin_id = Obtener_negocio(token, db)

    negocio_encontrado = db.query(negocio).filter(negocio.AD_id == admin_id).first()

    if not negocio_encontrado:
        raise HTTPException(404, "El administrador no tiene un negocio asignado")

    return negocio_encontrado


@route.post('/productos/')
async def crear_productos(
    producto: producto,
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    print(producto)
    # token = authorization.split(" ")[1] 
    # negocio = Obtener_Negocio(token, db)

    # verificar_existencia_producto(producto, db)

    # nuevo_producto = productos(
    #     negocio_id=negocio.id,
    #     codigo=producto.codigo_barras,
    #     nombre=producto.nombre,
    #     # descripcion=producto.descripcion,
    #     costo=producto.precio,
    #     precio=producto.precio_por_mayor,
    #     # stock=producto.stock,
    #     tiene_itbis=producto.tiene_itbis,
    #     activo=producto.activo
    # )

    # db.add(nuevo_producto)
    # db.commit()
    
    # Crear_collecion("Productos", producto.nombre, negocio.Sender_ID)

    # return {'mensaje': 'Producto agregado'}


@route.get('/obtenerProductos/')
async def obtener_productos(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    token = authorization.split(" ")[1] 
    verificar = Obtener_Negocio(token, db)

    obtener = db.query(productos).filter(productos.negocio_id == verificar.id).all()

    if not obtener:
        raise HTTPException(404, "No hay productos")

    return {
        "cantidad": len(obtener),
        "productos": [
            {
                "id": pro.id,
                "nombre": pro.nombre,
                "codigo": pro.codigo,
                "descripcion": pro.descripcion,
                "costo": pro.costo,
                "precio": pro.precio,
                "stock": pro.stock,
                "stock_minimo": pro.stock_minimo,
                "tiene_itbis": pro.tiene_itbis,
                "itbis": pro.itbis,
                "activo": pro.activo
            }
            for pro in obtener
        ]
    }
