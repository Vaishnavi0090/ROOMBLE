import React from 'react';

function RecievedMessage(props) {
    const Date_to_time = (date) => {
        // Convert date to time
        const time = new Date(date);
        return time.getHours() + ":" + time.getMinutes();
    }
    return (
        <div className="message">
        <img src="/sampleUser_Img.png" alt="Name" className="active-sender" />
        <div className="msgBox">
            <p className="msgText">{props.message}</p>
            <span className="sentTime">{Date_to_time(props.timestamp)}</span>
        </div>
    </div>
    );
}

export default RecievedMessage;