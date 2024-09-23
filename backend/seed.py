import yfinance as yf
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import StockTables


def insert_stock_data(ticker: str, db: Session):
    # Fetch stock data from yfinance
    data = yf.download(ticker, period="1y")
    data.reset_index(inplace=True)
    data.rename(columns={"Date": "Datetime"}, inplace=True)

    # Insert fetched data into the corresponding table
    for _, row in data.iterrows():
        new_record = StockTables[ticker](
            trade_date=row["Datetime"],
            open_price=row["Open"],
            high_price=row["High"],
            low_price=row["Low"],
            close_price=row["Close"],
            volume=row["Volume"],
        )
        db.add(new_record)

    db.commit()


def seed_data():
    db = SessionLocal()

    tickers = ["AAPL", "AMZN", "MSFT", "INTL"]
    for ticker in tickers:
        insert_stock_data(ticker, db)

    print("Data seeded successfully.")


if __name__ == "__main__":
    seed_data()
