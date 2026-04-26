import {useState} from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App(){

const currentUser={
id:2,
name:"Ilyes"
};

const [selectedChat,setSelectedChat]=useState(null);

/* only ONCE */
const [reload,setReload]=useState(false);


return(

<div className="app-layout">

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

export default App