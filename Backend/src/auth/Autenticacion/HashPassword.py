import bcrypt
from fastapi import HTTPException

def Hashear_Password(password: str) -> str:
    """
    Genera un hash seguro y devuelve texto UTF-8 listo para guardar en la BD.
    """
    hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')


def Verificar_Password(password_plano: str, password_hash: str) -> bool:
    """
    Verifica contraseña REAL vs HASH almacenado.
    """
    try:
        return bcrypt.checkpw(password_plano.encode('utf-8'), password_hash.encode('utf-8'))
    except:
        raise HTTPException(status_code=500, detail="Error verificando contraseña")