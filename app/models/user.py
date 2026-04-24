from sqlalchemy import Column, BigInteger, String, ForeignKey
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True)
    email = Column(String)
    role_id = Column(BigInteger, ForeignKey("role.id"))