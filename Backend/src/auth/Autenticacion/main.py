from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from Register import route as registro_route
from Login import route as login_route
from AgregarVendedor import route as agregar_vendedor_route
from Clientes_y_Facturas import route as Clientes_y_Facturas
from Anna import route as Anna 
from Productos import route as Productos
from Cotizaciones import route as Cotizaciones
from ScanBarCode import route as codigodebarras
from Obtener_Datos_frontpanel import route as frontpanel_route
from CRM import route as CRM

app = FastAPI()

# Registrar rutas
app.include_router(registro_route, prefix="/auth", tags=["Registro"])
app.include_router(login_route, prefix="/login", tags=["login"])
app.include_router(agregar_vendedor_route, prefix="/auth", tags=["Vendedor"])
app.include_router(Clientes_y_Facturas, prefix="/auth", tags=["Vendedor"])
app.include_router(Anna, prefix="/auth", tags=["Vendedor"])
app.include_router(Productos, prefix="/auth", tags=["Vendedor"])
app.include_router(Cotizaciones, prefix="/auth", tags=["Vendedor"])
app.include_router(codigodebarras, prefix="/auth", tags=["Vendedor"])
app.include_router(frontpanel_route, prefix="/auth", tags=["FrontPanel"])
app.include_router(CRM, prefix="/auth", tags=["CRM"])

@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido a la API de autenticación"}