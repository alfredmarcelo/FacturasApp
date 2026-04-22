from fastapi import APIRouter, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import requests
import asyncio
import httpx
from Basededatos import get_db, Clientes, AD, negocio, facturas
from JWT import ValidarToken

route = APIRouter()

class res(BaseModel):
    message: str

async def obtener_admin_id(token: str, db: Session):
    token_validado = ValidarToken(token)
    if not token_validado:
        raise HTTPException(400, "Token inválido")

    admin = db.query(AD).filter(AD.correo == token_validado["correo"]).first()

    if not admin:
        raise HTTPException(404, "Administrador no encontrado")

    return admin.id

@route.post('/anna/')
async def Enviar_y_obtener_respuesta(msj:res, authorization: str = Header(None), db: Session = Depends(get_db)):
    split = authorization.split(" ")[1]
    token = await obtener_admin_id(split, db)
    print(token)
    mensajes = {"mensaje":msj.message, 'ID': token, 'Tipo': 'Mensaje'}
    try:
        async with httpx.AsyncClient(timeout=100.0) as client:
            enviar = await client.post('http://localhost:5678/webhook/d4ea8182-384b-4353-b31b-ace44d930133', json = mensajes)
            print(enviar.json)
        return enviar.json() 
    except:
        print(enviar.text)
        return {"response": enviar.text} 
