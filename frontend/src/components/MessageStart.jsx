import React,{useState,useContext,useEffect} from 'react';
import '../css/MessageBoxStyle/Messages.css';
import MessageBox from './MessageComponents/MessageBox';
import ChatBoxEmpty from './MessageComponents/ChatBoxEmpty'
import { Basecontext } from '../context/base/Basecontext';
import axios from 'axios';

function MessageStart() {
  const state = useContext(Basecontext);
  const {user, setUser, fetuser} = state;
  const [currentMessages, setCurrentMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState("");


  useEffect(() => {
    setCurrentUserId(user._id);
    const fetchConversations = async () => {
      try {
        
        const res = await fetch('http://localhost:3000/messages/getConversations', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "authtoken": localStorage.getItem("authtoken")
          }
        })
        const data = await res.json();
        // console.log(data);
        if(data.success){
          setCurrentMessages(data.conversations);
        }
        else{
          console.log("Error fetching conversations");
        }

      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
  
    fetchConversations();
  }, [user]); 

  return (
    //Main container of the BOX which is divided into two parts
    //MessageBox and ChatBox
    <div className="message-container">
        {/*MessageBox contains the list of all the users*/}
        <MessageBox currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} currentMessages={currentMessages} setCurrentMessages={setCurrentMessages}/> 
        {/*ChatBoxEmpty*/}
        <ChatBoxEmpty/>
    </div>
  );
}

export default MessageStart;
