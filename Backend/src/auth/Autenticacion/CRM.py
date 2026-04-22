from fastapi import APIRouter, Header, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import requests
import asyncio
import httpx
from Basededatos import get_db, Clientes, AD, negocio, facturas
from JWT import ValidarToken
import requests

route = APIRouter()

class msj(BaseModel):
    id: int
    mensaje: str
    IA_Response: str

Clientes = []

@route.post('/Messeger/')
async def Messeger(msj: msj):
    Clientes.append("ID: " + str(msj.id))
    Clientes.append("Mensaje: " + msj.mensaje)
    Clientes.append("IA_Response: " + msj.IA_Response)
    print(Clientes)

@route.get('/Enviar_a_Frontend/')
async def Enviar_a_Frontend():
    return Clientes

