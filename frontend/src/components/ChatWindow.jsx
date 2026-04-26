import {useEffect,useState} from "react";

import {
getConversation,
sendMessage,
deleteMessage,
markAsRead
}
from "../api/messages";

import {getUsers}
from "../api/users";


function ChatWindow({
currentUser,
selectedChat
}){

const [messages,setMessages]=useState([]);
const [text,setText]=useState("");
const [users,setUsers]=useState({});



/* =========================
LOAD USERS
========================= */

const loadUsers=async()=>{

try{

const data=await getUsers();

const map={};

data.forEach(user=>{
map[user.id]=user.name;
});

setUsers(map);

}
catch(error){
console.log(error);
}

};



/* =========================
LOAD CONVERSATION
========================= */

const loadConversation=async()=>{

if(!selectedChat) return;

try{

const data=await getConversation(
currentUser.id,
selectedChat
);


for(const msg of data){

if(
msg.receiver_id===currentUser.id &&
!msg.read_at
){
await markAsRead(
msg.id_msg
);
}

}

setMessages(
data||[]
);

}
catch(error){
console.log(error);
}

};



useEffect(()=>{
loadUsers();
},[]);


useEffect(()=>{
loadConversation();
},
[
selectedChat,
currentUser.id
]);



/* =========================
SEND
========================= */

const handleSend=async()=>{

if(!text.trim()) return;

try{

await sendMessage(
currentUser.id,
selectedChat,
text
);

setText("");

loadConversation();

}
catch(error){
console.log(error);
alert(
error.message ||
"Message failed to send"
);
}

};



/* =========================
DELETE
========================= */

const handleDelete=async(id)=>{

if(
window.confirm(
"Delete this message?"
)
){

try{

await deleteMessage(
id,
currentUser.id
);

loadConversation();

}
catch(error){
console.log(error);
}

}

};



if(!selectedChat){

return(
<div className="chat-window">
<div className="chat-header">
Select a conversation
</div>
</div>
)

}



return(

<div className="chat-window">


<div className="chat-header">
Chat with {
users[selectedChat]
||
selectedChat
}
</div>



<div className="messages">

{
messages.map(msg=>(

<div
key={msg.id_msg}
className={
msg.sender_id===currentUser.id
?
"message-bubble sent"
:
"message-bubble received"
}
>

<div className="message-text">
{msg.content}
</div>



<div className="message-meta">

<span className="message-time">
{
new Date(
msg.sent_time
).toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
)
}
</span>


{
msg.sender_id===currentUser.id &&

<span className="seen-status">
{
msg.read_at
?
"✓✓ Seen"
:
"✓ Sent"
}
</span>

}

</div>



{
msg.sender_id===currentUser.id && (

<div className="message-actions">


<button
className="icon-btn"
title="Edit"
onClick={()=>
alert(
"Edit feature later"
)
}
>
✏️
</button>



<button
className="icon-btn delete-icon"
title="Delete"
onClick={()=>
handleDelete(
msg.id_msg
)
}
>
🗑️
</button>


</div>

)
}


</div>

))
}

</div>




<div className="chat-input">

<input
value={text}
onChange={(e)=>
setText(
e.target.value
)
}
placeholder="Type message..."
/>


<button
onClick={handleSend}
>
Send
</button>

</div>


</div>

)

}

export default ChatWindow