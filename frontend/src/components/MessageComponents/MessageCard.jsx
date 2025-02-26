
import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function MessageCard() {
    return (
        //This is the card which contains the user details
        <div className="card">
        <img src="/sampleUser_Img.png" alt="Name" className="sender-img" />
        <div className="sender-info">
            <span className="senderName">Name</span>
            <p className="last-message">Last message</p>
        </div>
        <div className='right'>
        <p className="time">10:30pm</p>
        <div className='newMsg'><p className='newMsgCount'>3</p></div>
        </div>
        
    </div>
     );
}


export default MessageCard;