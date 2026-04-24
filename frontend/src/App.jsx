import {useState} from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App(){

const [selectedChat,setSelectedChat]=useState(null);

/* force refresh trigger */
const [reload,setReload]=useState(false);

const currentUser={
id:5,
name:"User 1"
};

return(

<div className="app-container">

<Sidebar
currentUser={currentUser}
selectedChat={selectedChat}
setSelectedChat={setSelectedChat}
reload={reload}
/>

<ChatWindow
currentUser={currentUser}
selectedChat={selectedChat}
reload={reload}
setReload={setReload}
/>

</div>

)

}

export default App;