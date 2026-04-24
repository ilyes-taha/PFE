from sqlalchemy import Column, BigInteger, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class Conversation(Base):

    __tablename__="conversations"


    id=Column(
        BigInteger,
        primary_key=True,
        index=True
    )


    user1_id=Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False
    )


    user2_id=Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False
    )


    created_at=Column(
        DateTime,
        server_default=func.now()
    )