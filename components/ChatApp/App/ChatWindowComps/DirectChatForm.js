import React, {useState, useContext} from "react";
import UserContext from 'components/General/UserContext';
import ChatAppContext from 'components/General/ChatAppContext'
import axios from 'axios';
import {mutate} from 'swr'

import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

export default function DirectChatForm({data}) {

    const {userInChat} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    const [message, setMessage] = useState('');

    const handleChange = e => setMessage(e.target.value);

    const createMessage = async () => {
        try {
            const res = await axios.post('/api/messages', {
                text: message,
                user: loggedInUser.username, 
                userAvatar: loggedInUser.avatar
            })
            console.log('Created message', res.data)
            // add message to chat
            try {
                const resp = await axios.patch(`/api/chat/${userInChat._id}/addMessage`, {
                    messages: res.data.doc._id     
                })
                console.log('Message added to chat', resp.data)
            } catch (error) {
                console.log(error);
            }

        } catch (err) {
            console.log(err.response)
        }
    }
    const optimisticMessage = {
        _id: Math.random(),
        text: message,
        user: loggedInUser.username, 
        userAvatar: loggedInUser.avatar
    }
    const {chatMessages} = data;

    const handleSubmit= e => {
        e.preventDefault();
        mutate(`/api/chat/${userInChat._id}/chat-messages`,{...data, chatMessages: [...chatMessages,  optimisticMessage]}, false)
        createMessage();
        setMessage('');
        mutate(`/api/chat/${userInChat._id}/chat-messages`)
    };

    return (
        <div className="messageForm">
            <form onSubmit={handleSubmit}>
                <input className="input" placeholder="Type a message..."
                       type="text"
                       value={message}
                       onChange={handleChange}
                />
                <IconButton type="submit" className="submitButton" disabled={!message}>
                    <SendIcon/>
                </IconButton>
            </form>
        </div>
    )
}