import React,{
useEffect,
useState
} from "react";

import {
getConversation,
sendMessage,
deleteMessage
}
from "../api/messages";


function ChatWindow({
currentUser,
selectedChat,
setReload
}){

const [messages,setMessages]=useState([]);

const [text,setText]=useState("");

const [sendError,setSendError]=useState("");



const loadConversation=async()=>{

if(!selectedChat) return;


try{

const data=
await getConversation(
currentUser.id,
selectedChat
);

setMessages(data || []);

}

catch(error){
console.log(error);
}

};



useEffect(()=>{

loadConversation();

},[selectedChat]);



const handleSend=async()=>{

if(!text.trim()) return;

setSendError("");

try{

await sendMessage(
currentUser.id,
selectedChat,
text
);

setText("");

setSendError("");

loadConversation();

setReload(prev=>!prev);

}catch(error){
console.error("Failed to send message:", error);
setSendError(error.message || "Failed to send");
}

};

const handleKeyDown=(e)=>{
if(e.key==="Enter" && !e.shiftKey){
e.preventDefault();
handleSend();
}
};



const handleDelete=async(id)=>{

try{

await deleteMessage(id, currentUser.id);

loadConversation();

setReload(prev=>!prev);

}catch(error){
console.error("Failed to delete message:", error);
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
Chat with {selectedChat}
</div>



<div className="messages">

{
messages.map(msg=>(

<div
key={msg.id_msg}
className={
msg.sender_id===currentUser.id
?
"my-message"
:
"other-message"
}
>

<div>
{msg.content}
</div>


<button
className="delete-btn"
onClick={()=>
handleDelete(
msg.id_msg
)
}
>
Delete
</button>

</div>

))
}

</div>



<div className="message-box">

{sendError &&
<p style={{color:"red",margin:"0 0 8px 0",fontSize:"13px"}}>{sendError}</p>
}

<input
value={text}
onChange={(e)=>
setText(
e.target.value
)
}
onKeyDown={handleKeyDown}
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

export default ChatWindow;