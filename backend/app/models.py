from uuid import uuid4
from sqlalchemy import (
    UUID,
    Column,
    Date,
    Float,
    UniqueConstraint,
    String,
)

from .database import Base, engine


# STOCKS
# Function to dynamically create a stock table model for a given ticker
def create_stock_table(ticker):
    """
    Dynamically generates a SQLAlchemy model class for a stock ticker.

    :param ticker: The stock ticker (used as table name)
    :return: The SQLAlchemy model class for the ticker
    """

    # Create a unique class name by appending the ticker to 'Stock'
    class_name = f"Stock_{ticker}"

    # Dynamically create a new class
    return type(
        class_name,
        (Base,),
        {
            "__tablename__": ticker,
            "id": Column(UUID, primary_key=True, default=uuid4),
            "trade_date": Column(Date, nullable=False),
            "open_price": Column(Float),
            "high_price": Column(Float),
            "low_price": Column(Float),
            "close_price": Column(Float),
            "volume": Column(Float),
            "__table_args__": (
                UniqueConstraint("trade_date", name=f"uq_{ticker}_trade_date"),
            ),
        },
    )


def create_tables_for_tickers(tickers):
    tables = {}
    for ticker in tickers:
        stock_table = create_stock_table(ticker)

        # Create the table if it doesn't exist
        stock_table.__table__.create(engine, checkfirst=True)

        tables[ticker] = stock_table
    return tables


# Read and print the stock tickers that make up S&P500
# sp500 = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")[0]
# tickers = sp500.Symbol.to_list()
tickers = ["AAPL", "AMZN", "MSFT", "INTL"]

# Create tables
StockTables = create_tables_for_tickers(tickers)


# USER
class User(Base):
    __tablename__ = "users"
    id = Column(UUID, primary_key=True, default=uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
