import React,{useState,useContext,useEffect} from 'react';
import '../css/MessageBoxStyle/Messages.css';
import MessageBox from './MessageComponents/MessageBox';
import ChatBoxEmpty from './MessageComponents/ChatBoxEmpty'
import { Basecontext } from '../context/base/Basecontext';

function MessageStart() {
  const state = useContext(Basecontext);
  const {user, setUser, fetuser} = state;
  const [currentUserId, setCurrentUserId] = useState(user.userID);
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const userID = user.userID;
        if (!userID) {
          console.error("User ID not found");
          return;
        }
        const response = await axios.post('http://localhost:3000/api/messages/getConversations', { userID });
  
        if (response.data.success) {
          setConversations(response.data.conversations);
        } else {
          console.error("Failed to fetch conversations");
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };
  
    fetchConversations();
  }, []); 

  return (
    //Main container of the BOX which is divided into two parts
    //MessageBox and ChatBox
    <div className="message-container">
        {/*MessageBox contains the list of all the users*/}
        <MessageBox currentUserId={currentUserId} setCurrentUserId={setCurrentUserId} conversations={conversations} setConversations={setConversations}/> 
        {/*ChatBoxEmpty*/}
        <ChatBoxEmpty/>
    </div>
  );
}

export default MessageStart;
