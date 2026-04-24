from sqlalchemy import (
Column,
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
        Integer,
        primary_key=True,
        index=True
    )


    sender_id=Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    receiver_id=Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )


    sender_role_id=Column(
        Integer,
        ForeignKey("role.id"),
        nullable=False
    )


    receiver_role_id=Column(
        Integer,
        ForeignKey("role.id"),
        nullable=False
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