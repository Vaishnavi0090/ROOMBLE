import React from "react";
import DoneAllIcon from '@mui/icons-material/DoneAll';


function OwnMessage() {
    return (
        <div className="message own">
                <div className="msgBox">
                    <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?
                        <DoneAllIcon style={{ fontSize: 18, color: "#FDE6E8", marginLeft: 5 }} /></p>
                    <span className="sentTime">1 min ago</span>
        
                </div>
            </div>
    );
}

export default OwnMessage;