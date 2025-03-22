import React from 'react';
import '../../css/MessageBoxStyle/ChatBoxEmpty.css';

function ChatBoxEmpty() {
    return (
        <div className="chatBoxEmpty">
            <div className="chatBoxEmptyText">
                <h2 className='heading-conversation'>Start a conversation by selecting a user</h2>
            </div>
        </div>
    )
}

export default ChatBoxEmpty;