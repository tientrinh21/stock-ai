# import pandas as pd
import uvicorn
from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from app.database import SessionLocal, engine
from app.models import Base, create_tables_for_tickers

# Read and print the stock tickers that make up S&P500
# sp500 = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")[0]
# tickers = sp500.Symbol.to_list()
tickers = ["AAPL", "AMZN", "MSFT", "INTL"]

# Create tables
stock_tables = create_tables_for_tickers(tickers)
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
    data = db.query(stock_tables[ticker.upper()]).all()
    return data


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
