import {useEffect,useState} from "react";

import {
getThreads,
deleteConversation
}
from "../api/messages";

import {getUsers}
from "../api/users";

import NewMessageModal
from "./NewMessageModal";


function Sidebar({
currentUser,
selectedChat,
setSelectedChat,
reload
}){

const [threads,setThreads]=useState([]);
const [showModal,setShowModal]=useState(false);
const [users,setUsers]=useState({});



/* =====================
LOAD THREADS
===================== */

const loadThreads=async()=>{

try{

const data=
await getThreads(
currentUser.id
);

setThreads(
data||[]
);

}
catch(error){
console.log(error);
}

};



/* =====================
LOAD USERS
===================== */

const loadUsers=async()=>{

try{

const data=
await getUsers();

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



useEffect(()=>{
loadThreads();
},
[
reload,
currentUser.id
]);


useEffect(()=>{
loadUsers();
},[]);




const handleDeleteConversation=async(
otherUser
)=>{

if(
window.confirm(
"Delete this conversation?"
)
){

try{

await deleteConversation(
currentUser.id,
otherUser
);

if(
selectedChat===otherUser
){
setSelectedChat(
null
);
}

loadThreads();

}
catch(error){
console.log(error);
alert(
"Conversation delete failed"
);
}

}

};



return(

<>

<div className="sidebar">

<h1 className="logo">
Messages
</h1>


<p>
Logged in as:
<b>
 {users[currentUser.id] || currentUser.id}
</b>
</p>



<button
className="new-btn"
onClick={()=>
setShowModal(true)
}
>
+ New Message
</button>



<h3>
Inbox
</h3>



{
threads.length===0 &&
<p>
No conversations yet
</p>
}



{
threads.map(thread=>(

<div
key={thread.other_user}
onClick={()=>
setSelectedChat(
thread.other_user
)
}
className={
selectedChat===thread.other_user
? "chat-item active"
: thread.unread_count>0
? "chat-item unread"
: "chat-item"
}
>


<div className="avatar">
{
users[thread.other_user]
?
users[
thread.other_user
]
.charAt(0)
.toUpperCase()
:
thread.other_user
}
</div>



<div className="chat-preview">


<div className="chat-top">

<span className="chat-name">
{
users[thread.other_user]
||
`User ${thread.other_user}`
}
</span>


<span className="chat-time">
{
thread.last_time
?
new Date(
thread.last_time
).toLocaleTimeString(
[],
{
hour:"2-digit",
minute:"2-digit"
}
)
:
""
}
</span>

</div>



<div className={
thread.unread_count>0
?
"last-message unread-text"
:
"last-message"
}>
{thread.last_message}
</div>



{
thread.unread_count>0 &&
<span className="badge">
{thread.unread_count}
</span>
}



<button
className="conversation-delete-btn"
onClick={(e)=>{
e.stopPropagation();

handleDeleteConversation(
thread.other_user
);
}}
>
Delete
</button>



</div>

</div>

))
}


</div>



<NewMessageModal
show={showModal}
onClose={()=>
setShowModal(false)
}
setSelectedChat={setSelectedChat}
refreshThreads={loadThreads}
currentUser={currentUser}
/>


</>

)

}

export default Sidebar