import React from 'react';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { useRef,useEffect } from "react";


function SampleMessages() {
    const endRef=useRef(null);

    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:"smooth"});
    },[]);
    return (<div className="chatBody"><div className="message">
        <img src="/sampleUser_Img.png" alt="Name" className="active-sender" />
        <div className="msgBox">
            <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?</p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    
    <div className="message own">
        <div className="msgBox">
            <img src="/sampleUser_Img.png" alt="Name" className="img-msg" />
            <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?
                <DoneAllIcon style={{ fontSize: 18, color: "#FDE6E8", marginLeft: 5 }} /></p>
            <span className="sentTime">1 min ago</span>

        </div>
    </div>

    <div className="message">
        <img src="/sampleUser_Img.png" alt="Name" className="active-sender" />
        <div className="msgBox">
            <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?</p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    <div className="message own">
        
        <div className="msgBox">
            <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?
            <DoneAllIcon style={{ fontSize: 18, color: "#FDE6E8", marginLeft: 5 }} />
            </p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    <div className="message ">
        <div className="msgBox">
            <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?
                
            </p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    <div className="message own">
        <div className="msgBox">
            <p className="msgText">hello
            <DoneAllIcon style={{ fontSize: 18, color: "#FDE6E8", marginLeft: 5 }} />
            </p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    
    <div className="message own">
        <div className="msgBox">
       
            <p className="msgText">
            Hello

            <DoneAllIcon style={{ fontSize: 18, color: "#FDE6E8", marginLeft: 5 }} />
            </p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    <div ref={endRef}></div>
    </div>);
}
export default SampleMessages;