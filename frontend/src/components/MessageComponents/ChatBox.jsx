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
import useDidMountEffect from "../../useDidMountEffect";
import { socket } from "../../socket";

function ChatBox({currentConvId,setCurrentConvId,currentMessages,setCurrentMessages}) {

    const state = useContext(Basecontext)
    const {user, setUser, fetuser} = state

    const [emojiopen, setEmojiopen] = React.useState(false);//For Emoji Picker to make it open and close
    const [message, setMessage] = React.useState('');//For the message input
    const [otherUser, setOtherUser] = React.useState({name: "Loading...", status: "offline"});
    const endRef=useRef(null);

    useEffect(()=>{
        socket.on("update_online_users",()=>{
            const fetchUserNameStatus = async () => {
                try {
                    endRef.current?.scrollIntoView({ behavior: "smooth" });
    
        
                    // Fetch other username and status
                    const res = await fetch('http://localhost:3000/messages/getUserNameStatus', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ userID: currentMessages.members[0] == user._id ? currentMessages.members[1] : currentMessages.members[0] }),
                    });
    
                    const data = await res.json();
                    if (data.success) {
                        setOtherUser({ name: data.name, status: data.status });
                    } else {
                        console.error("Failed to fetch user name and status");
                    }
                } catch (err) {
                    console.error("Error fetching user name and status:", err);
                }
            };
        
            fetchUserNameStatus();
        })

        socket.on("message",(data)=>{
            // console.log(conversation_id);
            if(currentConvId==(data.conversation_id)){
                setCurrentMessages(data.messages);
                endRef.current?.scrollIntoView({ behavior: "smooth" });
            }
        })
    })

    
    useDidMountEffect(() => {
        const fetchUserNameStatus = async () => {
            try {
                endRef.current?.scrollIntoView({ behavior: "smooth" });

    
                // Fetch other username and status
                const res = await fetch('http://localhost:3000/messages/getUserNameStatus', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userID: currentMessages.members[0] == user._id ? currentMessages.members[1] : currentMessages.members[0] }),
                });

                const data = await res.json();
                if (data.success) {
                    setOtherUser({ name: data.name, status: data.status });
                } else {
                    console.error("Failed to fetch user name and status");
                }
            } catch (err) {
                console.error("Error fetching user name and status:", err);
            }
        };
    
        fetchUserNameStatus();
    }, [currentMessages]);
    
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
            // Send message to the backend
            const sendMsg = async () => {
                try {
                    const res = await fetch('http://localhost:3000/messages/sendMessage', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'authtoken': localStorage.getItem('authtoken'),
                        },
                        body: JSON.stringify({ conversation_id: currentConvId, message: message }),
                    });
                    const data = await res.json();
                    console.log(data);
                    if (data.success) {
                        console.log("Message sent successfully");
                        setMessage("");
                        // Update the current messages
                        setCurrentMessages(data.messages);
                        endRef.current?.scrollIntoView({ behavior: "smooth" });
                    } else {
                        console.error("Failed to send message");
                    }
                } catch (err) {
                    console.error("Error sending message:", err);
                }
            }
            sendMsg();
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
                <span className="activeSendername">{otherUser.name}</span>
                <p className="status">{otherUser.status}</p>
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
            {currentMessages.messages.map((msg,id) => {
                // console.log(msg);
                if (msg.senderID == user._id){
                    var blue = false;
                    // currentMessages.members has two members, one of them is the user. read1 and read2 are the read status of the two members respectively
                    // one of them is true trivially, so we check if the other is false
                    //first check if members[0] or members[1] is the user
                    if (currentMessages.members[0] == user._id){
                        if (msg.read2 == false){
                            blue = false;
                        }
                    }
                    else{
                        if (msg.read1 == false){
                            blue = false;
                        }
                    }
                    return <OwnMessage key={id} message={msg.message} timestamp={msg.timestamp} blue={blue}/>
                }
                else{
                    return <RecievedMessage key={id} message={msg.message} timestamp={msg.timestamp}/>
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
            <input onChange={handleChange} type="text" placeholder="Type a message..." value={message} className="msginput" onKeyDown={(e)=>{if(e.key==="Enter"){handleSend()}}}/>
            <SendIcon className="sendButton" style={{ fontSize: 30 ,color:"#7D141D" }} onClick={handleSend}/>
         </div>
    </div>;
    }
    export default ChatBox;