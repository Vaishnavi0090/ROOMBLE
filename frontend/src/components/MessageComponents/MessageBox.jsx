import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import MessageCard from './MessageCard.jsx';
import '../../css/MessageBoxStyle/MessageBox.css';

function MessageBox({currentUserId, setCurrentUserId, currentMessages, setCurrentMessages}) {
    //This is the main container of the message box which contains the list of all the users
    //It is divided into two parts 1)Top 2)Bottom
    return (<div className="message-cards">
        {/*Top contains the heading and search bar*/}
        <div className="top">
            <h2 className="people-text">People</h2>
            <div className='search-bar'>
            <SearchIcon style={{ fontSize: 30 }}/>
            <input type="text" placeholder="Search" className="chat-search-input" />
            </div>
        </div>
        {/*Bottom contains the list of all the users*/}
        {/*All message are temporary now. Map function will be used afterwards*/}
        <div className="bottom">
            {/* {currentMessages.map((conversation, index) => {
                return <MessageCard key={index} conversation={conversation}/>})} */}
        </div>
    </div>);
}
export default MessageBox;