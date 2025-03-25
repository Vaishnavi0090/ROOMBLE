
import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';

function MessageCard({conversation}) {

    const navigate = useNavigate();

    const Date_to_time = (timestamp) => {
        const time = new Date(timestamp);
        const now = new Date();
        
        const hours = time.getHours();
        const minutes = String(time.getMinutes()).padStart(2, '0'); // Ensures 2-digit minutes
        
        // Get today's and yesterday's dates (without time)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        // Get message date (without time)
        const msgDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());
    
        if (msgDate.getTime() === today.getTime()) {
            return `${hours}:${minutes}`;  // Show time if it's today
        } else if (msgDate.getTime() === yesterday.getTime()) {
            return `Yesterday`;  // Show "Yesterday" if it's yesterday
        } else {
            return time.toLocaleDateString();  // Show date for older messages
        }
    };
    
    

    const redirectto = (id) => {
        navigate("/chat/"+id);
    }

    return (
        //This is the card which contains the user details
        <div className="card" onClick={()=>{redirectto(conversation.conversation_id)}}>
        <img src={conversation.profilePic} alt="Name" className="sender-img" />
        <div className="sender-info">
            <span className="senderName">{conversation.name}</span>
            <p className="last-message">{conversation.lastMessage?conversation.lastMessage.message:"Click to start the chat"}</p>
        </div>
        <div className='right'>
        <p className="time">{conversation.lastMessage?Date_to_time(conversation.timestamp):""}</p>
        </div>
        
    </div>
     );
}


export default MessageCard;