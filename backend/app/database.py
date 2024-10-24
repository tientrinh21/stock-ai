import os

import dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

dotenv.load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "")

engine = create_engine(SQLALCHEMY_DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
