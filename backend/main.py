import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database import engine, get_db
from app import models, schemas, auth


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the OAuth2 scheme for token-based authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# STOCKS
@app.get("/stocks/{ticker}")
def read_stock_data(ticker: str, db: Session = Depends(get_db)):
    data = db.query(models.StockTables[ticker.upper()]).all()
    return data


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
    # Fetch holdings and transactions
    holdings = (
        db.query(models.StockHolding)
        .filter(models.StockHolding.user_id == current_user.id)
        .all()
    )
    transactions = (
        db.query(models.Transaction)
        .filter(models.Transaction.user_id == current_user.id)
        .all()
    )

    return {"user": current_user, "holdings": holdings, "transactions": transactions}


# Execute a transaction (buy, sell, deposit, withdraw)
@app.post("/transactions", response_model=schemas.Transaction)
def execute_transaction(
    transaction: schemas.TransactionCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    db_transaction = models.Transaction()

    # Handle "deposit" transactions
    if transaction.transaction_type == "deposit":
        current_user.balance += transaction.price  # price is the deposit amount
        db_transaction = models.Transaction(
            user_id=current_user.id,
            transaction_type="deposit",
            price=transaction.price,
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
        )

    # Handle "buy" transactions
    elif transaction.transaction_type == "buy":
        if transaction.shares is None:
            raise HTTPException(status_code=400, detail="Invalid number of shares")

        cost = transaction.shares * transaction.price

        if current_user.balance < cost:
            raise HTTPException(
                status_code=400, detail="Insufficient balance to buy shares"
            )
        current_user.balance -= cost
        # Add stock to holdings or update existing
        holding = (
            db.query(models.StockHolding)
            .filter(
                models.StockHolding.user_id == current_user.id,
                models.StockHolding.ticker == transaction.ticker,
            )
            .first()
        )
        if holding:
            holding.shares += transaction.shares
        else:
            holding = models.StockHolding(
                user_id=current_user.id,
                ticker=transaction.ticker,
                shares=transaction.shares,
            )
            db.add(holding)
        db_transaction = models.Transaction(
            user_id=current_user.id,
            transaction_type="buy",
            ticker=transaction.ticker,
            shares=transaction.shares,
            price=transaction.price,
        )

    # Handle "sell" transactions
    elif transaction.transaction_type == "sell":
        if transaction.shares is None:
            raise HTTPException(status_code=400, detail="Invalid number of shares")

        holding = (
            db.query(models.StockHolding)
            .filter(
                models.StockHolding.user_id == current_user.id,
                models.StockHolding.ticker == transaction.ticker,
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
            ticker=transaction.ticker,
            shares=transaction.shares,
            price=transaction.price,
        )

    # Record the transaction and commit changes
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return db_transaction


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
