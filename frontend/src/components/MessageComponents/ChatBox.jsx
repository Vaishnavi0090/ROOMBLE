import React from "react"; 
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EmojiPicker from 'emoji-picker-react';//For Emojis
import '../../css/MessageBoxStyle/ChatBox.css';//Importing CSS
import { useRef,useEffect } from "react";
import SampleMessages from "./SampleMessages";//Temporary Messages actually it will be fetched from the backend once the backend is ready
import OwnMessage from "./OwnMessage";
import RecievedMessage from "./RecievedMessage";
import { useContext } from 'react'
import { Basecontext } from '../../context/base/Basecontext'

function ChatBox({currentConvId,setCurrentConvId,currentMessages,setCurrentMessages}) {

    const state = useContext(Basecontext)
    const {user, setUser, fetuser} = state

    const [emojiopen, setEmojiopen] = React.useState(false);//For Emoji Picker to make it open and close
    const [message, setMessage] = React.useState('');//For the message input
    const endRef=useRef(null);
    
    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior:"smooth"});
    },[]);
    
    //For Emoji to add on the message
    function handleEmojiClick(event){
        setMessage(prev=>prev+event.emoji);
    } 
    //For message to appear on the screen
    function handleChange(event){
        setMessage(event.target.value);
    }

    function handleSend(){
        if(message){
            console.log(message);
            setMessage("");
        }
    }
    // Chats is divided into 3 parts 1)Heading 2)body 3)Input
    return <div className="chats">
        {/*Chat Heading contains details of current messaging user*/}
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
       {/*This contains messages which are temporary now*/}
       <div className="chatBody">
            
            {/* <RecievedMessage/>
            <OwnMessage/> */}
            {currentMessages.messages.map((msg) => {
                // console.log(msg);
                if (msg.senderID == user._id){
                    var blue = false;
                    // currentMessages.members has two members, one of them is the user. read1 and read2 are the read status of the two members respectively
                    // one of them is true trivially, so we check if the other is false
                    //first check if members[0] or members[1] is the user
                    if (currentMessages.members[0] == user._id){
                        if (msg.read2 == false){
                            blue = true;
                        }
                    }
                    else{
                        if (msg.read1 == false){
                            blue = true;
                        }
                    }
                    return <OwnMessage message={msg.message} timestamp={msg.timestamp} blue={blue}/>
                }
                else{
                    return <RecievedMessage message={msg.message} timestamp={msg.timestamp}/>
                }
            })}
            <div ref={endRef}></div>
       </div>
        {/*chatInput is where user types the message*/}
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
            </div>
            <input onChange={handleChange} type="text" placeholder="Type a message..." value={message} className="msginput"/>
            <SendIcon className="sendButton" style={{ fontSize: 30 ,color:"#7D141D" }} onClick={handleSend}/>
         </div>
    </div>;
    }
    export default ChatBox;