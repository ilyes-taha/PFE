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



export async function sendMessage(
senderId,
receiverId,
content
){

const res=await fetch(
"http://127.0.0.1:8000/messages/",
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

return await res.json();

}



export async function deleteMessage(
messageId
){

await fetch(
`${API}/delete/${messageId}`,
{
method:"PUT"
}
)

}