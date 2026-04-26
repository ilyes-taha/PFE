const API="http://127.0.0.1:8000/messages";



export async function getThreads(userId){

const res=await fetch(
`${API}/threads/${userId}`
);

return await res.json();

}



export async function getConversation(
user1,
user2
){

const res=await fetch(
`${API}/conversation/${user1}/${user2}`
);

return await res.json();

}



/* back to normal text messaging */
export async function sendMessage(
senderId,
receiverId,
content
){

const res=await fetch(
`${API}/`,
{
method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
sender_id:senderId,
receiver_id:receiverId,
content:content
})

}
);


if(!res.ok){

const err=
await res.json()
.catch(()=>({}));

throw new Error(
err.detail ||
`Error ${res.status}`
);

}

return await res.json();

}



export async function deleteMessage(
messageId,
userId
){

await fetch(
`${API}/delete/${messageId}?user_id=${userId}`,
{
method:"PUT"
}
);

}



export async function markAsRead(
messageId
){

await fetch(
`${API}/read/${messageId}`,
{
method:"PUT"
}
);

}



export async function getInbox(
userId
){

const res=await fetch(
`${API}/inbox/${userId}`
);

return await res.json();

}



export async function deleteConversation(
user1,
user2
){

await fetch(
`${API}/delete-conversation/${user1}/${user2}`,
{
method:"PUT"
}
);

}