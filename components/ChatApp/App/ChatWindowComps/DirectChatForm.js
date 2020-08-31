import React, {useState, useContext} from "react";
import UserContext from 'components/General/UserContext';
import ChatAppContext from 'components/General/ChatAppContext'
import ChatForm from 'components/General/ChatForm'
import axios from 'axios';
import {mutate} from 'swr'

import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

export default function DirectChatForm({data}) {

    const {userInChat} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    const [message, setMessage] = useState('');

    const optimisticMessage = {
        _id: Math.random(),
        text: message,
        user: loggedInUser.username, 
        userAvatar: loggedInUser.avatar
    }
    const {chatMessages} = data;

    const createMessage = async () => {
        mutate(`/api/chat/${userInChat._id}/chat-messages`,{...data, chatMessages: [...chatMessages,  optimisticMessage]}, false)
        try {
            const res = await axios.post('/api/messages', {
                text: message,
                user: loggedInUser.username, 
                userAvatar: loggedInUser.avatar
            })
            console.log('Created message', res.data)
            
            // add message to chat
            await axios.patch(`/api/chat/${userInChat._id}/addMessage`, {messages: res.data.doc._id})

        } catch (err) {
            mutate(`/api/chat/${userInChat._id}/chat-messages`,{...data, chatMessages}, false)
            console.log(err.response)
        }
        mutate(`/api/chat/${userInChat._id}/chat-messages`)
    }
    

    const handleSubmit= e => {
        e.preventDefault();
        createMessage();
        setMessage('');   
    };
    const handleChange = e => {
        setMessage(e.target.value)
    }

    return (
        <ChatForm handleChange={handleChange} handleSubmit={handleSubmit} message={message}/>
    )
}