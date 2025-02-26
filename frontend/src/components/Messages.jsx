import React from 'react';
import '../css/MessageBoxStyle/Messages.css';
import MessageBox from './MessageComponents/MessageBox';
import ChatBox from './MessageComponents/ChatBox';

function Messages() {
  return (
    //Main container of the BOX which is divided into two parts
    //MessageBox and ChatBox
    <div className="message-container">
        {/*MessageBox contains the list of all the users*/}
        <MessageBox/> 
        {/*ChatBox contains the chat of the selected user*/}
        <ChatBox/>
    </div>
  );
}

export default Messages;
