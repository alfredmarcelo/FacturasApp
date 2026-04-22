from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import session
from pydantic import BaseModel
from Basededatos import get_db, Usuarios, AD
from HashPassword import Verificar_Password 
from JWT import CrearToken

route = APIRouter()

class usuarios(BaseModel):
    correo: str
    password: str

def get_user(correo, db: session = Depends(get_db)):
    user = db.query(Usuarios).filter(Usuarios.correo == correo).first()
    if not user:
        raise HTTPException(status_code=400, detail='Usuario o contrasena no son validos')
    return user

def get_AD(id, db):
    obtener_AD = db.query(AD).filter(AD.id == id).first()
    if not obtener_AD:
        raise HTTPException(status_code=400, detail='AD no encontrado')
    return obtener_AD

@route.post('/login')
async def login(data: usuarios, db: session = Depends(get_db)):

    # 1. Buscar usuario
    user = get_user(data.correo, db)
    obtener_AD = get_AD(user.admin_id, db)

    # 2. Validar contraseña
    if not Verificar_Password(data.password, user.password):
        raise HTTPException(status_code=400, detail='Usuario o contraseña no válidos')

    # 3. Crear token
    token = CrearToken({"correo": data.correo})

    return {
        "mensaje": "Login exitoso",
        "token": token,
        "usuario": {
            "id": user.id,
            "correo": user.correo,
            "ad_id": obtener_AD.id,
            "ad_nombre": obtener_AD.nombre,
            "ad_apellido": obtener_AD.apellido,
            "ad_rnc": obtener_AD.rnc
        }
    }