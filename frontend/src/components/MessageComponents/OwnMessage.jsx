import React from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';


function OwnMessage(props) {

    const Date_to_time = (date) => {
        const time = new Date(date);
        const now = new Date();
    
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Midnight today
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Midnight yesterday
    
        const hours = time.getHours();
        const minutes = String(time.getMinutes()).padStart(2, '0'); // Ensures 2 digits
    
        if (time >= today) {
            return `${hours}:${minutes}`; // If today, return just time
        } else if (time >= yesterday) {
            return `Yesterday ${hours}:${minutes}`; // If yesterday, return "Yesterday HH:MM"
        } else {
            return `${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()} ${hours}:${minutes}`; // Else, return full date
        }
    };
    
    return (
        <div className="message own">
                <div className="msgBox">
                    <p className="msgText" style={{fontWeight: 300} }>{props.message}</p>

                    <span className="sentTime">{Date_to_time(props.timestamp)}</span>
        
                </div>
            </div>
    );
}

export default OwnMessage;