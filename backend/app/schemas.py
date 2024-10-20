from datetime import date
from pydantic import UUID4, BaseModel, EmailStr
from typing import List


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class User(BaseModel):
    id: UUID4
    username: str
    email: EmailStr
    balance: float

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class BalanceUpdate(BaseModel):
    amount: float


class TransactionCreate(BaseModel):
    transaction_type: str  # 'buy', 'sell', 'deposit', 'withdraw'
    ticker: str | None = None  # Only relevant for 'buy' and 'sell'
    shares: int | None = None  # Only relevant for 'buy' and 'sell'
    price: float


class Transaction(BaseModel):
    id: UUID4
    user_id: UUID4
    transaction_type: str
    ticker: str | None
    shares: int | None
    price: float
    trade_date: date

    class Config:
        from_attributes = True


class StockHolding(BaseModel):
    id: UUID4
    user_id: UUID4
    ticker: str
    shares: int

    class Config:
        from_attributes = True


class UserDetails(BaseModel):
    user: User
    holdings: List[StockHolding]
    transactions: List[Transaction]

    class Config:
        from_attributes = True
