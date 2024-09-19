from app.database import SessionLocal
from app.models import Author, Book


def seed_data():
    db = SessionLocal()

    # Create authors
    authors = [
        Author(
            name="J.R.R. Tolkien",
            bio="The creator of Middle-earth and author of The Lord of the Rings.",
        ),
        Author(
            name="George R.R. Martin",
            bio="The author of the epic fantasy series A Song of Ice and Fire.",
        ),
        Author(name="J.K. Rowling", bio="The creator of the Harry Potter series."),
    ]
    db.add_all(authors)
    db.commit()

    # Create books
    books = [
        Book(title="The Fellowship of the Ring", author=authors[0]),
        Book(title="The Two Towers", author=authors[0]),
        Book(title="The Return of the King", author=authors[0]),
        Book(title="A Game of Thrones", author=authors[1]),
        Book(title="A Clash of Kings", author=authors[1]),
        Book(title="Harry Potter and the Philosopher's Stone", author=authors[2]),
        Book(title="Harry Potter and the Chamber of Secrets", author=authors[2]),
    ]
    db.add_all(books)
    db.commit()

    print("Data seeded successfully.")


if __name__ == "__main__":
    seed_data()
