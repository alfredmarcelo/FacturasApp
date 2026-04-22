from sqlalchemy import create_engine, Column, VARCHAR, INTEGER, BOOLEAN, TEXT, TIMESTAMP, DATE, NUMERIC, ForeignKey
from sqlalchemy.orm import sessionmaker, declarative_base, relationship

engine = create_engine('postgresql://postgres:quind12345@localhost:5432/FacturaPOS')
SeccionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

base = declarative_base()

def get_db():
    db = SeccionLocal()
    try:
        yield db
    finally:
        db.close()


class Usuarios(base):
    __tablename__ = 'usuarios'

    id = Column(INTEGER, primary_key=True)
    correo = Column(VARCHAR)
    password = Column(VARCHAR)
    rol = Column(VARCHAR)
    activo = Column(BOOLEAN)
    fecha_creacion = Column(TIMESTAMP)
    admin_id = Column(INTEGER, ForeignKey('ad.id'))
    ad = relationship("AD", back_populates="usuarios")


class AD(base):
    __tablename__ = 'ad'

    id = Column(INTEGER, primary_key=True)
    nombre = Column(VARCHAR, nullable=False)
    apellido = Column(VARCHAR, nullable=False)
    rnc = Column(VARCHAR, unique=True)
    telefono = Column(VARCHAR)
    correo = Column(VARCHAR, unique=True)
    Codigo_vendedor = Column(VARCHAR, unique=True)

    negocio = relationship("negocio", back_populates="ads")
    usuarios = relationship("Usuarios", back_populates="ad")
    cotizaciones = relationship("cotizaciones", back_populates="ad")


class negocio(base):
    __tablename__ = 'negocio'

    id = Column(INTEGER, primary_key=True)
    nombre_negocio = Column(VARCHAR, nullable=False)
    ciudad = Column(VARCHAR)
    ubicacion = Column(VARCHAR)
    AD_id = Column(INTEGER, ForeignKey('ad.id'))

    ads = relationship("AD", back_populates="negocio")
    clientes = relationship("Clientes", back_populates="negocio")
    productos = relationship("productos", back_populates="negocio")


class Clientes(base):
    __tablename__ = 'clientes'

    id = Column(INTEGER, primary_key=True)
    nombre = Column(VARCHAR, nullable=False)
    cedula_rnc = Column(VARCHAR)
    telefono = Column(VARCHAR)
    direccion = Column(VARCHAR)
    email = Column(VARCHAR)
    tipo_cliente = Column(VARCHAR)
    negocio_id = Column(INTEGER, ForeignKey('negocio.id'))
    status = Column(VARCHAR)
    ad_id = Column(INTEGER)

    negocio = relationship("negocio", back_populates="clientes")
    facturas = relationship("facturas", back_populates="clientes")


class facturas(base):
    __tablename__ = 'facturas'

    id = Column(INTEGER, primary_key=True)
    ncf = Column(VARCHAR)
    tipo_ncf = Column(VARCHAR)
    fecha = Column(TIMESTAMP)
    fecha_vencimiento = Column(DATE)
    subtotal = Column(NUMERIC)
    descuento = Column(NUMERIC)
    itbis = Column(NUMERIC)
    total = Column(NUMERIC)
    forma_pago = Column(VARCHAR)
    estado = Column(VARCHAR)
    negocio_id = Column(INTEGER)
    ad_id = Column(INTEGER)

    cliente_id = Column(INTEGER, ForeignKey('clientes.id'))

    clientes = relationship('Clientes', back_populates="facturas")


class vendedores(base):
    __tablename__ = 'vendedores'

    id = Column(INTEGER, primary_key=True)
    nombre = Column(VARCHAR, nullable=False)
    apellido = Column(VARCHAR, nullable=False)
    telefono = Column(VARCHAR)
    correo = Column(VARCHAR, unique=True)


class productos(base):
    __tablename__ = 'productos'

    id = Column(INTEGER, primary_key=True)
    codigo = Column(VARCHAR, unique=True)
    nombre = Column(VARCHAR, nullable=False)
    descripcion = Column(TEXT)
    costo = Column(NUMERIC)
    precio = Column(NUMERIC)
    stock = Column(INTEGER)
    stock_minimo = Column(INTEGER)
    tiene_itbis = Column(BOOLEAN)
    activo = Column(BOOLEAN)
    itbis = Column(NUMERIC)
    negocio_id = Column(INTEGER, ForeignKey('negocio.id'))
    ad_id = Column(INTEGER)

    negocio = relationship('negocio', back_populates='productos')

class cotizaciones(base):
    __tablename__ = 'cotizaciones'

    id = Column(INTEGER, primary_key=True)
    rnc_cliente = Column(VARCHAR)
    nombre = Column(VARCHAR)
    fecha = Column(TIMESTAMP)
    fecha_validez = Column(DATE, nullable=False)
    total = Column(NUMERIC)
    subtotal = Column(NUMERIC)
    descuento = Column(NUMERIC)
    itbis = Column(NUMERIC)
    estado = Column(VARCHAR)
    ad_id = Column(INTEGER, ForeignKey('ad.id'))
    ad = relationship("AD", back_populates="cotizaciones")
