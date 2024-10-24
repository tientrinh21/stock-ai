import time
import threading
import uvicorn
import yfinance as yf
import pandas as pd

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import and_
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date, datetime

from app.database import engine, get_db
from app import models, schemas, auth

from seed import seed_data

df_sp500 = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")[0]
tickers_sp500 = df_sp500.Symbol.to_list()  # List of tickers in SP500
tickers_sp500.append("^GSPC")

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://stock-ai-skku.vercel.app",
        "https://stocktrade-skku.vercel.app",
    ],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# STOCKS
@app.get("/stocks/{ticker}")
def read_stock_data(
    ticker: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
):
    ticker_upper = ticker.upper()
    query = db.query(models.Stock).filter(models.Stock.ticker == ticker_upper)

    if ticker_upper not in tickers_sp500:
        raise HTTPException(status_code=400, detail="Ticker not found")

    # Set default end_date to today if not provided
    if end_date is None:
        end_date = datetime.now().date()

    # Filter by date range if start_date is provided
    if start_date:
        query = query.filter(
            and_(
                models.Stock.trade_date >= start_date,
                models.Stock.trade_date <= end_date,
            )
        )

    # Execute the query
    stocks = query.all()

    if not stocks:
        raise HTTPException(
            status_code=404, detail="No stocks found for the given criteria"
        )

    return stocks


@app.get("/stocks/{ticker}/quote")
def get_stock_quote(ticker: str):
    ticker_upper = ticker.upper()

    if ticker_upper not in tickers_sp500:
        raise HTTPException(status_code=400, detail="Ticker not found")

    try:
        stock = yf.Ticker(ticker_upper)
        # Fetch summary information using yfinance
        quote_data = stock.info

        print(quote_data)

        open = quote_data.get("regularMarketOpen", 0)
        previousClose = quote_data.get("regularMarketPreviousClose", 0)
        currentPrice = quote_data.get("currentPrice", 0)
        change = round(currentPrice - previousClose, 2)
        changePercent = round(change / previousClose * 100, 2)

        return {
            "ticker": quote_data.get("symbol", ticker_upper),
            "shortName": quote_data.get("shortName", ticker_upper),
            "longName": quote_data.get("longName", ticker_upper),
            "open": open,
            "previousClose": previousClose,
            "currentPrice": currentPrice,
            "change": change,
            "changePercent": changePercent,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error fetching stock data: {str(e)}"
        )


# USER
@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.User).filter(models.User.username == user.username).first()
    )
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        balance=0.0,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = (
        db.query(models.User).filter(models.User.username == form_data.username).first()
    )
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


async def get_current_user(
    token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)
):
    username = auth.verify_token(token)
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.get("/users/details", response_model=schemas.UserDetails)
async def read_users_details(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    # Fetch holdings, transactions, and watchlist
    holdings = (
        db.query(models.StockHolding)
        .filter(models.StockHolding.user_id == current_user.id)
        .all()
    )
    transactions = (
        db.query(models.Transaction)
        .filter(models.Transaction.user_id == current_user.id)
        .order_by(models.Transaction.trade_date.asc())
        .all()
    )
    watchlist = (
        db.query(models.Watchlist)
        .filter(models.Watchlist.user_id == current_user.id)
        .all()
    )

    return {
        "user": current_user,
        "holdings": holdings,
        "transactions": transactions,
        "watchlist": watchlist,
    }


# Execute a transaction (buy, sell, deposit, withdraw)
@app.post("/transactions", response_model=schemas.Transaction)
def execute_transaction(
    transaction: schemas.TransactionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    transaction_ticker_upper = (
        transaction.ticker.upper() if transaction.ticker is not None else None
    )

    db_transaction = models.Transaction()

    # Handle the trade_date logic (use the provided date or default to today)
    trade_date = transaction.trade_date or date.today()

    # Handle "deposit" transactions
    if transaction.transaction_type == "deposit":
        current_user.balance += transaction.price  # price is the deposit amount
        db_transaction = models.Transaction(
            user_id=current_user.id,
            transaction_type="deposit",
            price=transaction.price,
            trade_date=trade_date,
        )

    # Handle "withdraw" transactions
    elif transaction.transaction_type == "withdraw":
        if current_user.balance < transaction.price:
            raise HTTPException(
                status_code=400, detail="Insufficient balance for withdrawal"
            )
        current_user.balance -= transaction.price  # price is the withdraw amount
        db_transaction = models.Transaction(
            user_id=current_user.id,
            transaction_type="withdraw",
            price=transaction.price,
            trade_date=trade_date,
        )

    # Handle "buy" transactions
    elif transaction.transaction_type == "buy":
        if transaction_ticker_upper not in tickers_sp500:
            raise HTTPException(status_code=400, detail="Ticker not found")

        if transaction.shares is None:
            raise HTTPException(status_code=400, detail="Invalid number of shares")

        cost = transaction.shares * transaction.price

        if current_user.balance < cost:
            raise HTTPException(
                status_code=400, detail="Insufficient balance to buy shares"
            )
        current_user.balance -= cost

        # Check if ticker is in watchlist and add if it is not
        watchlist_item = (
            db.query(models.Watchlist)
            .filter(
                models.Watchlist.user_id == current_user.id,
                models.Watchlist.ticker == transaction_ticker_upper,
            )
            .first()
        )
        if not watchlist_item:
            new_watchlist_item = models.Watchlist(
                user_id=current_user.id, ticker=transaction_ticker_upper
            )
            db.add(new_watchlist_item)

        # Add stock to holdings or update existing
        holding = (
            db.query(models.StockHolding)
            .filter(
                models.StockHolding.user_id == current_user.id,
                models.StockHolding.ticker == transaction_ticker_upper,
            )
            .first()
        )
        if holding:
            holding.shares += transaction.shares
        else:
            holding = models.StockHolding(
                user_id=current_user.id,
                ticker=transaction_ticker_upper,
                shares=transaction.shares,
            )
            db.add(holding)

        db_transaction = models.Transaction(
            user_id=current_user.id,
            transaction_type="buy",
            ticker=transaction_ticker_upper,
            shares=transaction.shares,
            price=transaction.price,
            trade_date=trade_date,
        )

    # Handle "sell" transactions
    elif transaction.transaction_type == "sell":
        if transaction_ticker_upper not in tickers_sp500:
            raise HTTPException(status_code=400, detail="Ticker not found")

        if transaction.shares is None:
            raise HTTPException(status_code=400, detail="Invalid number of shares")

        holding = (
            db.query(models.StockHolding)
            .filter(
                models.StockHolding.user_id == current_user.id,
                models.StockHolding.ticker == transaction_ticker_upper,
            )
            .first()
        )
        if holding is None or holding.shares < transaction.shares:
            raise HTTPException(status_code=400, detail="Insufficient shares to sell")
        holding.shares -= transaction.shares
        current_user.balance += transaction.shares * transaction.price

        # Remove holding if all shares are sold
        if holding.shares == 0:
            db.delete(holding)

        db_transaction = models.Transaction(
            user_id=current_user.id,
            transaction_type="sell",
            ticker=transaction_ticker_upper,
            shares=transaction.shares,
            price=transaction.price,
            trade_date=trade_date,
        )

    # Record the transaction and commit changes
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return db_transaction


@app.get("/watchlist", response_model=List[schemas.Watchlist])
def get_watchlist(
    current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)
):
    watchlist = (
        db.query(models.Watchlist)
        .filter(models.Watchlist.user_id == current_user.id)
        .all()
    )
    return watchlist


@app.post("/watchlist", response_model=schemas.Watchlist)
def add_to_watchlist(
    ticker: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if ticker.upper() not in tickers_sp500:
        raise HTTPException(status_code=400, detail="Ticker not found")

    # Check if the ticker is already in the watchlist
    existing = (
        db.query(models.Watchlist)
        .filter(
            models.Watchlist.user_id == current_user.id,
            models.Watchlist.ticker == ticker.upper(),
        )
        .first()
    )

    if existing:
        raise HTTPException(status_code=400, detail="Ticker already in watchlist")

    new_watchlist_item = models.Watchlist(
        user_id=current_user.id, ticker=ticker.upper()
    )
    db.add(new_watchlist_item)
    db.commit()
    db.refresh(new_watchlist_item)

    return new_watchlist_item


@app.delete("/watchlist/{ticker}")
def delete_from_watchlist(
    ticker: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    watchlist_item = (
        db.query(models.Watchlist)
        .filter(
            models.Watchlist.user_id == current_user.id,
            models.Watchlist.ticker == ticker.upper(),
        )
        .first()
    )

    if not watchlist_item:
        raise HTTPException(status_code=404, detail="Ticker not found in watchlist")

    db.delete(watchlist_item)
    db.commit()

    return {"message": f"{ticker} removed from watchlist"}


# Continuous data seeding in the background
def continuous_seed():
    while True:
        seed_data()
        time.sleep(60 * 30)  # Run every 30 minutes


def start_background_task():
    threading.Thread(target=continuous_seed, daemon=True).start()


start_background_task()

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
