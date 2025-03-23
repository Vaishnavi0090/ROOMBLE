import React, { useState, useContext, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MessageCard from './MessageCard.jsx';
import '../../css/MessageBoxStyle/MessageBox.css';
import { Basecontext } from '../../context/base/Basecontext';
import { socket } from '../../socket.js';

function MessageBox() {

    const state = useContext(Basecontext);
    const { user, setUser, fetuser } = state;
    const [currentMessages, setCurrentMessages] = useState([]);
    const [currentUserId, setCurrentUserId] = useState("");


    useEffect(() => {
        setCurrentUserId(user._id);
        const fetchConversations = async () => {
            try {
                const res = await fetch('http://localhost:3000/messages/getConversations', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authtoken": localStorage.getItem("authtoken")
                    }
                })
                const data = await res.json();
                if (data.success) {
                    setCurrentMessages(data.conversations);
                }

            } catch (error) {
                
            }
        };

        fetchConversations();
    }, [user]);

    useEffect(()=>{
        socket.on("message", (data) => {
            const fetchConversations = async () => {
                try {
    
                    const res = await fetch('http://localhost:3000/messages/getConversations', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "authtoken": localStorage.getItem("authtoken")
                        }
                    })
                    const data = await res.json();
                    if (data.success) {
                        setCurrentMessages(data.conversations);
                    }
    
                } catch (error) {
                    
                }
            };
    
            fetchConversations();
        })
    })


    return (<div className="message-cards">
        {/*Top contains the heading and search bar*/}
        <div className="top">
            <h2 className="people-text">People</h2>
            <div className='search-bar'>
                <SearchIcon style={{ fontSize: 30 }} />
                <input type="text" placeholder="Search" className="chat-search-input" />
            </div>
        </div>
        {/*Bottom contains the list of all the users*/}
        {/*All message are temporary now. Map function will be used afterwards*/}
        <div className="bottom">
            {currentMessages.map((conversation, index) => {
                return <MessageCard key={index} conversation={conversation} />
            })}

        </div>
    </div>);
}
export default MessageBox;