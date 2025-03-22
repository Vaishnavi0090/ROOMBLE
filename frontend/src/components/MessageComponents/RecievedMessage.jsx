import React from 'react';

function RecievedMessage(props) {
    return (
        <div className="message">
        <img src="/sampleUser_Img.png" alt="Name" className="active-sender" />
        <div className="msgBox">
            <p className="msgText">{props.message}</p>
            <span className="sentTime">{props.timestamp}</span>
        </div>
    </div>
    );
}

export default RecievedMessage;