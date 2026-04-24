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
selectedChat
}){

const [messages,setMessages]=useState([]);

const [text,setText]=useState("");



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


await sendMessage(
currentUser.id,
selectedChat,
text
)

setText("");

loadConversation();

};



const handleDelete=async(id)=>{

await deleteMessage(id);

loadConversation();

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

export default ChatWindow;