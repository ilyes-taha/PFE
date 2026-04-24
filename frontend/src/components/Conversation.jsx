import {
useEffect,
useState
}
from "react";

import {
getConversation,
markAsRead
}
from "../api/messages";


function Conversation(
{
currentUser,
otherUserId
}
){

const [messages,setMessages]=
useState([]);


const loadConversation=
async()=>{

const data=
await getConversation(
currentUser.id,
otherUserId
);

for(let msg of data){

if(
msg.receiver_id===
currentUser.id &&
!msg.read_at
){
await markAsRead(
msg.id_msg
);
}

}

setMessages(data);

};


useEffect(()=>{

loadConversation();

const interval=
setInterval(
loadConversation,
3000
);

return ()=>clearInterval(
interval
);

},[]);



return(

<div>

<h2>Conversation</h2>

{
messages.map(msg=>(

<div
key={msg.id_msg}

style={{
textAlign:
msg.sender_id===
currentUser.id
?
"right"
:
"left"
}}
>

<span
style={{
display:"inline-block",
padding:"10px",
background:
msg.sender_id===
currentUser.id
?
"#dcf8c6"
:
"#eee"
}}
>

{msg.content}

</span>

</div>

))
}

</div>

);

}

export default Conversation;