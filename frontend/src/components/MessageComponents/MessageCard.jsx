
import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function MessageCard(conversation) {

    return (
        //This is the card which contains the user details
        <div className="card" onClick={()=>{console.log("Clicked")}}>
        <img src="/sampleUser_Img.png" alt="Name" className="sender-img" />
        <div className="sender-info">
            <span className="senderName">{conversation.otherUser}</span>
            <p className="last-message">{conversation.lastMessage}</p>
        </div>
        <div className='right'>
        <p className="time">{conversation.timestamp}</p>
        {conversation.unread !=0 && <div className='newMsg'><p className='newMsgCount'>{conversation.unread}</p></div>}
        </div>
        
    </div>
     );
}


export default MessageCard;