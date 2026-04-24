import {useEffect,useState} from "react";
import {getThreads} from "../api/messages";
import {getUsers} from "../api/users";
import NewMessageModal from "./NewMessageModal";


function Sidebar({
currentUser,
selectedChat,
setSelectedChat,
reload
}){

const [threads,setThreads]=useState([]);
const [showModal,setShowModal]=useState(false);

/* users from database */
const [users,setUsers]=useState({});



const loadThreads=async()=>{

try{

const data=
await getThreads(
currentUser.id
);

setThreads(data || []);

}

catch(error){
console.log(error);
}

};



const loadUsers=async()=>{

try{

const data=
await getUsers();

const userMap={};

data.forEach(
user=>{
userMap[user.id]=user.name;
}
);

setUsers(userMap);

}

catch(error){
console.log(error);
}

};



useEffect(()=>{

loadThreads();

loadUsers();

},[reload]);



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

className={
selectedChat===thread.other_user
?
"chat-item active"
:
"chat-item"
}

onClick={()=>
setSelectedChat(
thread.other_user
)
}
>

<div className="avatar">

{
users[thread.other_user]
?
users[thread.other_user]
.charAt(0)
.toUpperCase()
:
thread.other_user
}

</div>



<div className="chat-preview">

<div>
<b>

{
users[thread.other_user]
?
users[thread.other_user]
:
`User ${thread.other_user}`
}

</b>
</div>



<div className="last-message">
{thread.last_message}
</div>



{
thread.unread_count>0 &&

<span className="badge">
{thread.unread_count}
</span>

}


</div>

</div>

))
}


</div>



<NewMessageModal
show={showModal}
onClose={()=>setShowModal(false)}
setSelectedChat={setSelectedChat}
refreshThreads={loadThreads}
currentUser={currentUser}
/>

</>

)

}

export default Sidebar;