import React from 'react';

function RecievedMessage() {
    return (
        <div className="message">
        <img src="/sampleUser_Img.png" alt="Name" className="active-sender" />
        <div className="msgBox">
            <p className="msgText">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum laborum consectetur tempore eum enim at, animi dicta et, repudiandae eos incidunt ducimus, maiores dolore vitae sapiente rem aliquam est doloremque?</p>
            <span className="sentTime">1 min ago</span>
        </div>
    </div>
    );
}

export default RecievedMessage;