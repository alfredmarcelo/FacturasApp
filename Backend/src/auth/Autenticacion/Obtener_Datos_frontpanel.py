from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
import datetime

from Basededatos import get_db, facturas, negocio, AD
from JWT import ValidarToken


route = APIRouter()


# ============================================================
# FUNCIONES DE UTILIDAD
# ============================================================

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

@route.get('/VentasHoy/')
async def obtener_total_ventas_hoy(
    authorization: str = Header(None),
    db: Session = Depends(get_db)
):
    """
    Obtiene el total sumado de las ventas de hoy.
    """
    negocio_admin = await validar_header_negocio(authorization, db)
    hoy = datetime.date.today()
    
    # Calcular el total directamente con SUM en la base de datos
    total_hoy = db.query(func.coalesce(func.sum(facturas.total), 0)).filter(
        facturas.negocio_id == negocio_admin,
        func.date(facturas.fecha) == hoy
    ).scalar()

    ayer = datetime.date.today() - datetime.timedelta(days=1)
    print(ayer)
    # Calcular el total directamente con SUM en la base de datos
    total_ayer = db.query(func.coalesce(func.sum(facturas.total), 0)).filter(
        facturas.negocio_id == negocio_admin,
        func.date(facturas.fecha) == ayer
    ).scalar()
    
    
    return {"total_hoy": float(total_hoy), "total_ayer": float(total_ayer)}
