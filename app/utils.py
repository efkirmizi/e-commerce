from passlib.context import CryptContext 

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash(password: str):
    hashed_password = pwd_context.hash(password)
    return hashed_password

def verify_password(password_database_hashed, password_credentials):
    return pwd_context.verify(password_credentials, password_database_hashed)
