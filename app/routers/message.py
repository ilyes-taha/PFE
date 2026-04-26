from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.message import Message
from app.models.user import User


router = APIRouter(
prefix="/messages",
tags=["Messages"]
)

class MessageCreate(BaseModel):
    sender_id:int
    receiver_id:int
    content:str
class EditMessage(BaseModel):
    content:str


# =========================
# SEND MESSAGE
# =========================

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


    if sender.role_id==receiver.role_id:
        raise HTTPException(
           status_code=403,
           detail="Users with same role cannot chat"
        )


    msg=Message(
      sender_id=sender.id,
      receiver_id=receiver.id,
      content=data.content
    )

    db.add(msg)
    db.commit()
    db.refresh(msg)

    return msg



# =========================
# CONVERSATION
# IMPORTANT:
# removed deleted filters
# so deleted message stays visible
# =========================

@router.get(
"/conversation/{user1_id}/{user2_id}"
)
def get_conversation(
user1_id:int,
user2_id:int,
db:Session=Depends(get_db)
):

    messages=(
      db.query(Message)
      .filter(
        or_(

          and_(
            Message.sender_id==user1_id,
            Message.receiver_id==user2_id
          ),

          and_(
            Message.sender_id==user2_id,
            Message.receiver_id==user1_id
          )

        )
      )
      .order_by(
        Message.sent_time.asc()
      )
      .all()
    )

    return messages



# =========================
# THREADS
# =========================

@router.get("/threads/{user_id}")
def get_threads(
user_id:int,
db:Session=Depends(get_db)
):

    messages=(
      db.query(Message)
      .filter(
        or_(
          Message.sender_id==user_id,
          Message.receiver_id==user_id
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

            preview=(
              "This message was deleted"
              if msg.is_deleted
              else msg.content
            )

            threads[other_user]={
               "other_user":other_user,
               "last_message":preview,
               "last_time":msg.sent_time,
               "unread_count":0
            }


        if(
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


@router.put("/edit/{message_id}")
def edit_message(
message_id:int,
data:EditMessage,
db:Session=Depends(get_db)
):

    msg=(
      db.query(Message)
      .filter(
        Message.id_msg==message_id
      )
      .first()
    )

    if not msg:
        raise HTTPException(
          status_code=404,
          detail="Message not found"
        )

    msg.content=data.content

    db.commit()

    return {
      "message":"updated"
    }
# =========================
# READ
# =========================

@router.put("/read/{message_id}")
def mark_read(
message_id:int,
db:Session=Depends(get_db)
):

    msg=(
      db.query(Message)
      .filter(
       Message.id_msg==message_id
      )
      .first()
    )

    if not msg:
       raise HTTPException(
         status_code=404,
         detail="Not found"
       )


    msg.read_at=datetime.utcnow()

    db.commit()

    return {"message":"read"}



# =========================
# DELETE FOR EVERYONE
# =========================

@router.put("/delete/{message_id}")
def delete_message(
message_id:int,
user_id:int,
db:Session=Depends(get_db)
):

    msg=(
      db.query(Message)
      .filter(
         Message.id_msg==message_id
      )
      .first()
    )


    if not msg:
        raise HTTPException(
          status_code=404,
          detail="Not found"
        )


    if msg.sender_id!=user_id:
        raise HTTPException(
          status_code=403,
          detail="Only sender can delete"
        )


    msg.is_deleted=True
    msg.delete_time=datetime.utcnow()

    db.commit()

    return {
      "message":"deleted for everyone"
    }



# =========================
# DELETE CONVERSATION
# =========================

@router.put(
"/delete-conversation/{user1_id}/{user2_id}"
)
def delete_conversation(
user1_id:int,
user2_id:int,
db:Session=Depends(get_db)
):

    messages=(
      db.query(Message)
      .filter(
        or_(

          and_(
             Message.sender_id==user1_id,
             Message.receiver_id==user2_id
          ),

          and_(
             Message.sender_id==user2_id,
             Message.receiver_id==user1_id
          )

        )
      )
      .delete(
        synchronize_session=False
      )
    )

    db.commit()

    return {
      "message":"conversation deleted"
    }