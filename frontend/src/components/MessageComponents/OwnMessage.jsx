import React from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';


function OwnMessage(props) {

    const Date_to_time = (date) => {
        // Convert date to time
        const time = new Date(date);
        return time.getHours() + ":" + time.getMinutes();
    }
    return (
        <div className="message own">
                <div className="msgBox">
                    <p className="msgText">{props.message}
                        <DoneAllIcon style={{ fontSize: 18, color: props.blue?"#00ddff":"#808080" , marginLeft: 5 }} /></p>

                    <span className="sentTime">{Date_to_time(props.timestamp)}</span>
        
                </div>
            </div>
    );
}

export default OwnMessage;