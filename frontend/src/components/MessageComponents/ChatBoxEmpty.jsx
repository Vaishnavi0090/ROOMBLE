import React from 'react';
import '../../css/MessageBoxStyle/ChatBoxEmpty.css';
import NoChatSelected from './NoChatSelected';

function ChatBoxEmpty() {
    return (
        <div className="chatBoxEmpty">
            <div className="chatBoxEmptyText">
                <h2 className='heading-conversation'><NoChatSelected/></h2>
            </div>
        </div>
    )
}

export default ChatBoxEmpty;