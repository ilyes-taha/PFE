import {
useEffect,
useState
} from "react";

import {
getInbox
} from "../api/messages";

function Inbox(
{
currentUser
}
){

const [messages,setMessages]=
useState([]);


const loadInbox=async()=>{

try{

const data=
await getInbox(
currentUser.id
);

setMessages(data || []);

}catch(error){
console.error("Failed to load inbox:", error);
}

};


useEffect(()=>{

loadInbox();

const interval=
setInterval(
loadInbox,
3000
);

return ()=>clearInterval(
interval
);

},[]);


return(

<div>

<h2>Inbox</h2>

{
messages.map(msg=>(

<div
key={msg.id_msg}
style={{
fontWeight:
msg.read_at
?"normal"
:"bold",

color:
msg.read_at
?"gray"
:"black"
}}
>

From user {msg.sender_id}

<p>{msg.content}</p>

<hr/>

</div>

))
}

</div>

);

}

export default Inbox;