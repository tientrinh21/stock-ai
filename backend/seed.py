import yfinance as yf
# import pandas as pd

from sqlalchemy.orm import Session
from sqlalchemy.dialects.postgresql import insert
from datetime import datetime

from app.database import SessionLocal
from app.models import Stock


def insert_stock_data(ticker: str, db: Session):
    # Get the latest trade date for the given ticker
    latest_record = (
        db.query(Stock)
        .filter(Stock.ticker == ticker)
        .order_by(Stock.trade_date.desc())
        .first()
    )

    if latest_record:
        latest_trade_date = latest_record.trade_date
        print(f"The latest trade date of {ticker} is: {latest_trade_date}.")
        data = yf.download(
            ticker, start=latest_trade_date, end=datetime.now()
        )  # Fetch stock data from latest trade date
    else:
        print(f"No records of {ticker} found.")
        data = yf.download(ticker, period="1y")  # Fetch the latest 1 year of stock data

    # Reset index and rename the Date column
    data.reset_index(inplace=True)
    data.rename(columns={"Date": "trade_date"}, inplace=True)

    # Insert fetched data into the corresponding table
    for _, row in data.iterrows():
        new_record = {
            "ticker": ticker,  # Include ticker in the record
            "trade_date": row["trade_date"],
            "open_price": row["Open"],
            "high_price": row["High"],
            "low_price": row["Low"],
            "close_price": row["Close"],
            "volume": row["Volume"],
        }

        stmt = insert(Stock).values(new_record)
        stmt = stmt.on_conflict_do_nothing(
            index_elements=["ticker", "trade_date"]
        )  # Handle conflicts by doing nothing

        db.execute(stmt)

    db.commit()


def seed_data():
    db = SessionLocal()

    # You can uncomment this to fetch the S&P 500 tickers if needed
    # df_sp500 = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")[0]
    # tickers_sp500 = df_sp500.Symbol.to_list()  # List of tickers in S&P 500

    # Example tickers for testing
    tickers = ["AAPL", "AMZN", "MSFT", "INTC", "TSLA"]

    for ticker in tickers:
        insert_stock_data(ticker, db)

    print("Data seeded successfully.")


if __name__ == "__main__":
    seed_data()
