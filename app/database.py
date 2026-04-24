from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = "postgresql://postgres:alita@127.0.0.1:7588/PFE"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()


# ✅ ADD THIS FUNCTION
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()