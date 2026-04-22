from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import session
from Basededatos import get_db, AD
from pydantic import BaseModel
from JWT import ValidarToken
import uuid
import time

route = APIRouter()


class VendedorCodigo(BaseModel):
    codigo: bool
    token: str

@route.post('/generar_codigo')
def CrearCodigo(codigo: VendedorCodigo, db: session = Depends(get_db)):
    validar_token = ValidarToken(codigo.token)
    
    if not validar_token:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    usuario_actual = db.query(AD).filter(AD.correo == validar_token['correo']).first()

    if not usuario_actual:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    if codigo.codigo:
        codigo_unico = str(uuid.uuid4())
        usuario_actual.Codigo_vendedor = codigo_unico
        db.commit()
        db.refresh(usuario_actual)
        return {"codigo_vendedor": codigo_unico}
    

def borrar_codigo(codigo: VendedorCodigo, db: session = Depends(get_db)):
    while True: 
        validar_token = ValidarToken(codigo.token)
    
        if not validar_token:
            raise HTTPException(status_code=401, detail="Token inválido")
    
        usuario_actual = db.query(AD).filter(AD.correo == validar_token.correo).first()
        
        if codigo.codigo:
            time.sleep(60) 
            usuario_actual.Codigo_vendedor = None
            db.refresh(usuario_actual)
            db.commit()
            return {"mensaje": "Código de vendedor eliminado exitosamente"}
        