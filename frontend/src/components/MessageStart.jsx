import React,{useState,useContext,useEffect} from 'react';
import '../css/MessageBoxStyle/Messages.css';
import MessageBox from './MessageComponents/MessageBox';
import ChatBoxEmpty from './MessageComponents/ChatBoxEmpty'

function MessageStart() {
  return (
    //Main container of the BOX which is divided into two parts
    //MessageBox and ChatBox
    <div className="message-container">
        <MessageBox/>
        <ChatBoxEmpty/>
    </div>
  );
}

export default MessageStart;
