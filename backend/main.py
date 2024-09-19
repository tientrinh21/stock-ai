from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
import uvicorn

from app.models import Author, Book, Base
from app.database import SessionLocal, engine

Base.metadata.create_all(bind=engine)

app = FastAPI()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/authors/")
def read_authors(db: Session = Depends(get_db)):
    authors = db.query(Author).all()
    return authors


@app.get("/books/{author_id}")
def read_books(author_id: int, db: Session = Depends(get_db)):
    books = db.query(Book).filter(Book.author_id == author_id).all()
    return books


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
