from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

router=APIRouter(
prefix="/users",
tags=["Users"]
)


@router.get("/")
def get_users(
db:Session=Depends(get_db)
):

 users=db.query(User).all()

 return [
 {
   "id":u.id,
   "name":u.email.split("@")[0] if u.email else str(u.id)
 }
 for u in users
 ]