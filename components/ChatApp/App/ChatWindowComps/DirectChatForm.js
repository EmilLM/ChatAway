import React, {useState, useContext} from "react";
import UserContext from 'components/General/UserContext';
import ChatAppContext from 'components/General/ChatAppContext'
import axios from 'axios';
import {mutate, trigger} from 'swr'

import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

export default function DirectChatForm() {

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
            // try set res in state and extract messageId from that and then use it in addMessageToRoom
        } catch (err) {
            console.log(err.response)
        }
    }

    const addMessageToChat= async () => {
        try {
            const res = await axios.patch(`/api/chat/${userInChat._id}/addMessage`, {
                messages: {
                    text: message,
                    user: loggedInUser.username,
                    userAvatar: loggedInUser.avatar
                }
            })
            console.log('Message added to chat', res.data)
        } catch (err) {
            console.log(err)
        }
    }


    const handleSubmit= e => {
        e.preventDefault();
        createMessage();
        addMessageToChat();
        setMessage('');
        mutate(`/api/chat/${userInChat._id}`)
        trigger(`/api/chat/${userInChat._id}`)
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