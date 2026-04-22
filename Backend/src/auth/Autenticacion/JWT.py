import jwt
import secrets

JWT_Encrypt = secrets.token_hex(32)
secret = '21321321312312'
Algorithm = 'HS256'

def CrearToken(data: dict) -> str:
    token = jwt.encode(data, secret, algorithm=Algorithm)
    return token

def ValidarToken(token: str) -> dict:
    decoded = jwt.decode(token, secret, algorithms=[Algorithm])
    return decoded
