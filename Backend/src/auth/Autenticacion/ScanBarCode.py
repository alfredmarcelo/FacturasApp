from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel
import datetime

from Basededatos import get_db, Clientes, AD, negocio, facturas, productos
from JWT import ValidarToken


route = APIRouter()

class codigos(BaseModel):
    codigo: str

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


@route.post('/codigodebarras/')
async def CodigoDeBarras(codigogo: codigos, authorization: str = Header(None), db: Session = Depends(get_db)):
    
    token = authorization.split(' ')[1]
    negocio_id = obtener_negocio(token, db)

    try:
        producto = db.query(productos).filter(productos.negocio_id == negocio_id.id).all()
        for prod in producto:
            print(prod.codigo, codigogo.codigo)
            if prod.codigo == codigogo.codigo:
                return {
                    'id': prod.id,
                    'nombre': prod.nombre,
                    'costo': prod.costo,
                    'precio': prod.precio,
                    'itbis': prod.itbis
                }
    except ValueError as e:
        print(e)