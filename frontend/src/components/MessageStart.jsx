import React,{useState,useContext,useEffect} from 'react';
import '../css/MessageBoxStyle/Messages.css';
import MessageBox from './MessageComponents/MessageBox';
import ChatBoxEmpty from './MessageComponents/ChatBoxEmpty'
import { Basecontext } from '../context/base/Basecontext';
import axios from 'axios';

function MessageStart() {
  const state = useContext(Basecontext);
  const {user, setUser, fetuser} = state;
  const [currentUserId, setCurrentUserId] = useState(user._id);
  const [currentMessages, setCurrentMessages] = useState([]);
  useEffect(() => {

    const fetchConversations = async () => {
      try {
        if (!user || !user._id) {  // Wait until user is available
          return;  // Don't run the API call
        }
        const userID = user._id;
        const authToken = localStorage.getItem("authtoken");
        if(!authToken){
          console.error("Auth token not found");
          return;
        }
        if (!userID) {
          console.error("User ID not found");
          return;
        }
        const response = await axios.post('http://localhost:3000/messages/getConversations', { userID },{
          headers: {
            authtoken: token,
          },
        });
        if (response.data.success) {
          setCurrentMessages(response.data.conversations);
          console.log("Conversations fetched Successfully");
          console.log("Conversations fetched:", response.data.conversations);
        } else {
          console.error("Failed to fetch conversations");
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
