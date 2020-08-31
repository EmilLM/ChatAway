import React, {useState, useContext} from "react";
import UserContext from 'components/General/UserContext';
import ChatAppContext from 'components/General/ChatAppContext'
import ChatForm from 'components/General/ChatForm'
import axios from 'axios';
import {mutate} from 'swr'

import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

export default function RoomForm({data}) {

    const {userInRoom} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    const [message, setMessage] = useState("");

    const optimisticMessage = {
        _id: Math.random()*10,
        text: message,
        user: loggedInUser.username, 
        userAvatar: loggedInUser.avatar
    }
    const {roomMessages} = data;

    const createMessage = async () => {

        mutate(`/api/rooms/${userInRoom._id}/room-messages`,{...data, roomMessages: [...roomMessages,  optimisticMessage]}, false)
        try {
            const res = await axios.post('/api/messages', {
                text: message,
                user: loggedInUser.username, 
                userAvatar: loggedInUser.avatar
            })
            // console.log('Created message', res.data)

            // add message to room
            await axios.patch(`/api/rooms/${userInRoom._id}/addMessage`, {
                messages: res.data.doc._id
            })  

        } catch (err) {
            // revert mutate changes
            mutate(`/api/rooms/${userInRoom._id}/room-messages`,{...data, roomMessages}, false)
            console.log(err.response)
        }
        mutate(`/api/rooms/${userInRoom._id}/room-messages`)
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