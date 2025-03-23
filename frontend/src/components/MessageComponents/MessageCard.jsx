
import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import {useNavigate} from 'react-router-dom';

function MessageCard({conversation}) {
    const navigate = useNavigate();

    const handleClick = (conversation) => {
        navigate(`/chat/${conversation.conversation_id}`);
    }

    return (
        //This is the card which contains the user details
        <div className="card" onClick={()=>{handleClick(conversation)}}>
        <img src={conversation.profilePic} alt="Name" className="sender-img" />
        <div className="sender-info">
            <span className="senderName">{conversation.name}</span>
            <p className="last-message">msg</p>
        </div>
        <div className='right'>
        <p className="time">{conversation.timestamp}</p>
        {conversation.unread !=0 && <div className='newMsg'><p className='newMsgCount'>{conversation.unread}</p></div>}
        </div>
        
    </div>
     );
}


export default MessageCard;