from sqlalchemy import (
Column,
BigInteger,
Integer,
Text,
Boolean,
DateTime,
ForeignKey
)

from sqlalchemy.sql import func

from app.database import Base



class Message(Base):

    __tablename__="messages"



    id_msg=Column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
        index=True
    )


    sender_id=Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False
    )


    receiver_id=Column(
        BigInteger,
        ForeignKey("users.id"),
        nullable=False
    )


    sender_role_id=Column(
        BigInteger,
        ForeignKey("role.id"),
        nullable=True
    )


    receiver_role_id=Column(
        BigInteger,
        ForeignKey("role.id"),
        nullable=True
    )


    content=Column(
        Text,
        nullable=False
    )


    sent_time=Column(
        DateTime,
        server_default=func.now()
    )


    read_at=Column(
        DateTime,
        nullable=True
    )


    deleted_by_sender=Column(
        Boolean,
        default=False
    )


    deleted_by_receiver=Column(
        Boolean,
        default=False
    )


    delete_time=Column(
        DateTime,
        nullable=True
    )