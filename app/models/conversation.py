from sqlalchemy import Column,Integer,DateTime
from sqlalchemy.sql import func

from app.database import Base


class Conversation(Base):

    __tablename__="conversations"


    id=Column(
        Integer,
        primary_key=True,
        index=True
    )


    user1_id=Column(
        Integer,
        nullable=False
    )


    user2_id=Column(
        Integer,
        nullable=False
    )


    created_at=Column(
        DateTime,
        server_default=func.now()
    )