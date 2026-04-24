from sqlalchemy import Column, BigInteger, String, Text
from app.database import Base

class Role(Base):
    __tablename__ = "role"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(100))
    description = Column(Text)