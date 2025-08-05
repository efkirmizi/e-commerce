from fastapi import FastAPI
from app.routers import accounts, auth, carts, categories, products, users, comments
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine

Base.metadata.create_all(engine)

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(auth.router)
app.include_router(carts.router)
app.include_router(categories.router)
app.include_router(products.router)
app.include_router(users.router)
app.include_router(comments.router)
