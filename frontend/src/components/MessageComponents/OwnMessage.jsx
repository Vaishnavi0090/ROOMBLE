import React from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';


function OwnMessage(props) {

    const Date_to_time = (date) => {
        // let time = date.getHours() + ":" + date.getMinutes();
        // return date;
        // date in string format, return only time like 10:30 AM

        // let time = date.split("T")[1].split(":");
        // let hours = time[0];
        // let minutes = time[1];
        // let ampm = "AM";
        // if (hours > 12) {
        //     hours -= 12;
        //     ampm = "PM";
        // }
        // return hours + ":" + minutes + " " + ampm;

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