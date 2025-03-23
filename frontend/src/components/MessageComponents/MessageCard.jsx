
import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useNavigate } from 'react-router-dom';

function MessageCard({conversation}) {

    const navigate = useNavigate();

    const Date_to_time = (date) => {
        // Convert date to time
        const time = new Date(date);
        return time.getHours() + ":" + time.getMinutes();
    }

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