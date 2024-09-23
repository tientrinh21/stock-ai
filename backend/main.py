# import pandas as pd
import uvicorn
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app.models import Base, StockTables


Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/stocks/{ticker}")
def read_stock_data(ticker: str, db: Session = Depends(get_db)):
    data = db.query(StockTables[ticker.upper()]).all()
    return data


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
