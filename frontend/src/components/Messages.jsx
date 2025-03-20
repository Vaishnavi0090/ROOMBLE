import React,{useState} from 'react';
import '../css/MessageBoxStyle/Messages.css';
import MessageBox from './MessageComponents/MessageBox';
import ChatBox from './MessageComponents/ChatBox';

function Messages() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentMessages, setCurrentMessages] = useState([]);

  return (
    //Main container of the BOX which is divided into two parts
    //MessageBox and ChatBox
    <div className="message-container">
        {/*MessageBox contains the list of all the users*/}
        <MessageBox currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages}/> 
        {/*ChatBox contains the chat of the selected user*/}
        <ChatBox currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages}/>
    </div>
  );
}

export default Messages;
