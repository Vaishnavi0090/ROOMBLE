import React from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiPicker from 'emoji-picker-react';

import '../../css/MessageBoxStyle/ChatBox.css';
import { useRef,useEffect } from "react";
import SampleMessages from "./SampleMessages";


function ChatBox() {
    const [emojiopen, setEmojiopen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    

    function handleEmojiClick(event){
        setMessage(prev=>prev+event.emoji);
    } 
    function handleChange(event){
        setMessage(event.target.value);
    }

    return <div className="chats">
       <div className="chatHeading">
        <div className="active-sender">
            <img src="/sampleUser_Img.png" alt="Name" className="active-sender" />
            <div className="text">
                <span className="activeSendername">Name</span>
                <p className="status">Online</p>
            </div>

        </div>
        <div className="Menu">
            <MoreVertIcon style={{ fontSize: 30 }}/>
        </div>
       </div>
       
       <SampleMessages/>
        
         <div className="chatInput">
            <div className="icons">
                <div className="emoji">
                    <EmojiEmotionsOutlinedIcon style={{ fontSize: 30, }} onClick={()=>{setEmojiopen(prev=>{return !prev})}} />
                    {emojiopen && (
                        <div className="picker">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    
                </div>
                
                <div className="attach">
                    <AttachFileIcon style={{ fontSize: 30 }}/>
                </div>

            </div>
            <input onChange={handleChange} type="text" placeholder="Type a message..." value={message} className="msginput"/>
            <SendIcon className="sendButton" style={{ fontSize: 30 ,color:"#7D141D" }}/>
         </div>
    </div>;
    }
    export default ChatBox;