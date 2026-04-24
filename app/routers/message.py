from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.message import Message
from app.models.user import User

router = APIRouter(prefix="/messages", tags=["Messages"])


# ==============================
# SCHEMA
# ==============================

class MessageCreate(BaseModel):
    sender_id:int
    receiver_id:int
    content:str

# ==============================
# SEND MESSAGE
# ==============================

@router.post("/")
def send_message(
data:MessageCreate,
db:Session=Depends(get_db)
):

    sender=db.query(User).filter(
        User.id==data.sender_id
    ).first()


    receiver=db.query(User).filter(
        User.id==data.receiver_id
    ).first()


    if not sender or not receiver:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    if sender.id==receiver.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot message yourself"
        )


    # REMOVE THIS if everyone can talk:
    # if sender.role_id==receiver.role_id:
    #     raise HTTPException(...)



    message=Message(
        sender_id=sender.id,
        receiver_id=receiver.id,

        sender_role_id=
        sender.role_id,

        receiver_role_id=
        receiver.role_id,

        content=data.content
    )


    db.add(message)

    db.commit()

    db.refresh(message)


    return message

# ==============================
# INBOX
# ==============================

@router.get("/inbox/{user_id}")
def get_inbox(user_id: int, db: Session = Depends(get_db)):

    messages = db.query(Message)\
        .filter(
            Message.receiver_id == user_id,
            Message.deleted_by_receiver == False
        )\
        .order_by(Message.sent_time.desc())\
        .all()

    return messages

# ==============================
# CONVERSATION
# ==============================

@router.get("/conversation/{user1_id}/{user2_id}")
def get_conversation(user1_id: int, user2_id: int, db: Session = Depends(get_db)):

    messages = db.query(Message).filter(
        or_(
            and_(
                Message.sender_id == user1_id,
                Message.receiver_id == user2_id,
                Message.deleted_by_sender == False,
                Message.deleted_by_receiver == False
            ),
            and_(
                Message.sender_id == user2_id,
                Message.receiver_id == user1_id,
                Message.deleted_by_sender == False,
                Message.deleted_by_receiver == False
            )
        )
    ).order_by(Message.sent_time.asc()).all()

    return messages


# ==============================
# UNREAD MESSAGES
# ==============================

@router.get("/unread/{user_id}")
def get_unread_messages(user_id: int, db: Session = Depends(get_db)):

    messages = db.query(Message)\
        .filter(
            Message.receiver_id == user_id,
            Message.read_at == None
        )\
        .order_by(Message.sent_time.desc())\
        .all()

    return messages


# ==============================
# UNREAD COUNT
# ==============================

@router.get("/unread/count/{user_id}")
def count_unread_messages(user_id: int, db: Session = Depends(get_db)):

    count = db.query(Message)\
        .filter(
            Message.receiver_id == user_id,
            Message.read_at == None
        )\
        .count()

    return {"unread_count": count}


# ==============================
# MARK AS READ
# ==============================

@router.put("/read/{message_id}")
def mark_as_read(message_id: int, db: Session = Depends(get_db)):

    message = db.query(Message).filter(Message.id_msg == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    message.read_at = datetime.utcnow()

    db.commit()

    return {"message": "Marked as read"}

# ==============================
# DELETE MESSAGE (soft delete)
# ==============================

@router.put("/delete/{message_id}")
def delete_message(message_id: int, user_id: int, db: Session = Depends(get_db)):

    message = db.query(Message).filter(Message.id_msg == message_id).first()

    if not message:
        raise HTTPException(status_code=404, detail="Message not found")

    # if sender deletes
    if message.sender_id == user_id:
        message.deleted_by_sender = True

    # if receiver deletes
    elif message.receiver_id == user_id:
        message.deleted_by_receiver = True

    else:
        raise HTTPException(status_code=403, detail="Not allowed")

    # optional: set delete time
    message.delete_time = datetime.utcnow()

    db.commit()

    return {"message": "Deleted successfully"}
# ==============================
# CONVERSATION THREADS (NEW INBOX)
# ==============================

@router.get("/threads/{user_id}")
def get_threads(
user_id:int,
db:Session=Depends(get_db)
):

    messages=(
        db.query(Message)
        .filter(
            or_(
                and_(
                    Message.sender_id==user_id,
                    Message.deleted_by_sender==False
                ),
                and_(
                    Message.receiver_id==user_id,
                    Message.deleted_by_receiver==False
                )
            )
        )
        .order_by(
            Message.sent_time.desc()
        )
        .all()
    )


    threads={}


    for msg in messages:

        other_user=(
            msg.receiver_id
            if msg.sender_id==user_id
            else msg.sender_id
        )


        if other_user not in threads:

            threads[other_user]={
                "other_user":other_user,
                "last_message":msg.content,
                "last_time":msg.sent_time,
                "unread_count":0
            }


        if (
            msg.receiver_id==user_id
            and
            msg.read_at is None
        ):

            threads[
             other_user
            ]["unread_count"]+=1


    return list(
        threads.values()
    )