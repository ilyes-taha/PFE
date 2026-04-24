import {useState} from "react";
import {sendMessage} from "../api/messages";

function SendMessage(
{
currentUser,
receiverId
}
){

const [content,setContent]=useState("");

const handleSend=async()=>{

if(!content.trim()) return;

await sendMessage(
receiverId,
content
);

setContent("");

};

return(

<div>

<h2>New Message</h2>

<input
value={content}
onChange={(e)=>
setContent(e.target.value)
}
/>

<button onClick={handleSend}>
Send
</button>

</div>

);

}

export default SendMessage;