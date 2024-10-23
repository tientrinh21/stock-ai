from uuid import uuid4
from datetime import date
from sqlalchemy import (
    UUID,
    Column,
    Date,
    Float,
    Integer,
    UniqueConstraint,
    String,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from .database import Base


# STOCKS
class Stock(Base):
    __tablename__ = "stocks"

    id = Column(UUID, primary_key=True, default=uuid4)
    ticker = Column(String, nullable=False)
    trade_date = Column(Date, nullable=False)
    open_price = Column(Float)
    high_price = Column(Float)
    low_price = Column(Float)
    close_price = Column(Float)
    volume = Column(Float)

    __table_args__ = (
        UniqueConstraint("ticker", "trade_date", name="uq_ticker_trade_date"),
    )


# USER
class User(Base):
    __tablename__ = "users"

    id = Column(UUID, primary_key=True, default=uuid4)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    balance = Column(Float, default=0.0, nullable=False)

    transactions = relationship("Transaction", back_populates="user")
    holdings = relationship("StockHolding", back_populates="user")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(UUID, ForeignKey("users.id"))
    transaction_type = Column(
        String, nullable=False
    )  # 'buy', 'sell', 'deposit', 'withdraw'
    ticker = Column(String)
    shares = Column(Integer)
    price = Column(Float, nullable=False)
    trade_date = Column(Date, nullable=False, default=date.today)

    user = relationship("User", back_populates="transactions")


class StockHolding(Base):
    __tablename__ = "stock_holdings"

    id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(UUID, ForeignKey("users.id"))
    ticker = Column(String, nullable=False)
    shares = Column(Integer, nullable=False)

    user = relationship("User", back_populates="holdings")


class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(UUID, primary_key=True, default=uuid4)
    user_id = Column(UUID, ForeignKey("users.id"), nullable=False)
    ticker = Column(String, nullable=False)

    # Ensure a user cannot have duplicate tickers in their watchlist
    __table_args__ = (UniqueConstraint("user_id", "ticker", name="uq_user_ticker"),)
