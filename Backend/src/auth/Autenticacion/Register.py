from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import session
from pydantic import BaseModel
from Basededatos import get_db, Usuarios, AD, vendedores, negocio
from HashPassword import Hashear_Password
from JWT import CrearToken, ValidarToken

route = APIRouter()

class usuarios(BaseModel):
    correo: str
    password: str
    rol: str

class Datos_AD(BaseModel):
    nombre: str
    apellido: str
    rnc: str
    tipo_negocio: str
    telefono: str
    correo: str
    password: str

class Datos_Negocio(BaseModel):
    nombre_negocio: str
    ciudad: str
    ubicacion: str

class vendedores_Datos(BaseModel):
    nombre: str
    apellido: str
    telefono: str
    correo: str
    password: str

class Token(BaseModel):
    token: str

def get_user(datos, db: session = Depends(get_db)):
    if db.query(Usuarios).filter(Usuarios.correo == datos.correo).first():
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    return True

def Crear_usuario(correo: str, password: str,  rol: str, db: session = Depends(get_db)):
    
    admin = db.query(AD).filter(AD.correo == correo).first()

    nuevo_usuario = Usuarios(
        correo=correo,
        password=Hashear_Password(password),
        rol=rol,
        activo=True,
        admin_id = admin.id
    )
    db.add(nuevo_usuario)
    db.commit()
    db.refresh(nuevo_usuario)
    token = CrearToken({"correo": correo, "contraseña": password})
    return {"mensaje": "Usuario registrado exitosamente", "token": token}

@route.post('/registrarse/admin')
def registrar_AD(datos_AD: Datos_AD, db: session = Depends(get_db)):

    if get_user(datos_AD, db):
        nuevo_usuario = AD(
            nombre=datos_AD.nombre,
            apellido=datos_AD.apellido,
            rnc=datos_AD.rnc,
            correo=datos_AD.correo,
            telefono=datos_AD.telefono,
            Codigo_vendedor=None
        )
        db.add(nuevo_usuario)
        db.commit()
    
    return Crear_usuario(datos_AD.correo, datos_AD.password, 'ADMIN', db)

@route.post('/registrarse/vendedor')
def registrar_vendedor(datos_vendedor: vendedores_Datos, db: session = Depends(get_db)):

    if get_user(datos_vendedor, db):
        nuevo_vendedor = vendedores(
            nombre=datos_vendedor.nombre,
            apellido=datos_vendedor.apellido,
            correo=datos_vendedor.correo,
            telefono=datos_vendedor.telefono,
        )
        db.add(nuevo_vendedor)
        db.commit()
    
    return Crear_usuario(datos_vendedor.correo, datos_vendedor.password, 'VENDEDOR', db)

@route.post('/registrarse/negocio')
def registrar_negocio(datos_negocio: Datos_Negocio, token_data: Token, db: session = Depends(get_db)):

    # Validar token
    TokenInfo = ValidarToken(token_data.token)
    if not TokenInfo:
        raise HTTPException(status_code=401, detail='Token no válido')

    # Buscar admin por correo dentro del token
    admin = db.query(AD).filter(AD.correo == TokenInfo['correo']).first()

    if not admin:
        raise HTTPException(status_code=404, detail="El administrador no existe")

    # Crear negocio
    nuevo_negocio = negocio(
        nombre_negocio=datos_negocio.nombre_negocio,
        ciudad=datos_negocio.ciudad,
        ubicacion=datos_negocio.ubicacion,
        AD_id = admin.id
    )

    db.add(nuevo_negocio)
    db.commit()
    db.refresh(nuevo_negocio)

    return {"mensaje": "Negocio registrado exitosamente", "negocio_id": nuevo_negocio.id}

