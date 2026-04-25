import {useState} from "react";
import {sendMessage} from "../api/messages";

function NewMessageModal({
show,
onClose,
setSelectedChat,
refreshThreads,
currentUser
}){

const [receiver,setReceiver]=useState("");
const [content,setContent]=useState("");
const [error,setError]=useState("");

if(!show) return null;


const handleSend=async()=>{

if(!receiver || !content) return;

setError("");

try{

await sendMessage(
currentUser.id,
parseInt(receiver),
content
);

/* refresh sidebar immediately */
await refreshThreads();


/* open conversation instantly */
setSelectedChat(
parseInt(receiver)
);


setReceiver("");
setContent("");

onClose();

}catch(err){
setError(err.message || "Failed to send message");
}

};


return(
<div className="modal-overlay">
<div className="modal-box">

<h2>New Message</h2>

<input
placeholder="Receiver ID"
value={receiver}
onChange={(e)=>
setReceiver(e.target.value)
}
/>

<textarea
placeholder="Write message"
value={content}
onChange={(e)=>
setContent(e.target.value)
}
/>

{error &&
<p style={{color:"red"}}>{error}</p>
}

<div className="modal-buttons">

<button
className="send-btn"
onClick={handleSend}
>
Send
</button>

<button
className="cancel-btn"
onClick={onClose}
>
Cancel
</button>

</div>

</div>
</div>
)

}

export default NewMessageModal;