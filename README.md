# PFE Messaging Module

## Description
This project is a messaging module developed as part of a Final Year Project (PFE).

It provides an internal private messaging system between users with role-based communication constraints.

## Features

- Private messaging between users
- Inbox / conversation threads
- Unread messages badge
- Seen status (✓ Sent / ✓✓ Seen)
- Timestamp for each message
- Delete individual messages
- Delete full conversations
- Delete for everyone
- Role restrictions:
  - Prestataire can only message Demandeur
  - Demandeur can only message Prestataire
  - Same-role messaging blocked

---

## Technologies Used

### Backend
- FastAPI
- Python
- SQLAlchemy
- PostgreSQL

### Frontend
- React.js
- JavaScript
- CSS

### Version Control
- Git
- GitHub

---

## Project Structure

```bash
PFE/
│
├── app/
│   ├── models/
│   ├── routers/
│   └── database.py
│
├── frontend/
│   └── src/
│       ├── components/
│       └── api/
```

---

## Main Functionalities

### Messaging
- Send messages
- Receive messages
- View conversations
- Mark messages as read

### Conversation Management
- Delete messages
- Delete conversations
- Read/unread tracking

### Business Rules
- Communication allowed only between different roles.

---

## API Endpoints

### Messages

```http
POST /messages/
GET /messages/conversation/{user1}/{user2}
GET /messages/threads/{user_id}
PUT /messages/read/{message_id}
PUT /messages/delete/{message_id}
PUT /messages/delete-conversation/{u1}/{u2}
```

---

## Installation

### Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on:

```bash
http://127.0.0.1:8000
```

---

### Frontend

```bash
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## Database
PostgreSQL database stores:

- Users
- Roles
- Messages
- Read/Seen status
- Deletion states

---


## Future Improvements

- Real-time messaging (WebSockets)
- File and image sharing
- Notifications
- Search in conversations

---

## Author
Developed by Ilyes Taha  
PFE Project — Messaging Module
