import React, {useState, useContext} from "react";
import UserContext from 'components/General/UserContext';
import ChatAppContext from 'components/General/ChatAppContext'
import axios from 'axios';
import useSWR, {mutate, trigger} from 'swr'

import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

export default function RoomForm() {

    const {userInRoom} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    const [message, setMessage] = useState("");

    const handleChange = e => {
       setMessage(e.target.value)

    };

    const createMessage = async () => {
        try {
            const res = await axios.post('/api/messages', {
                text: message,
                user: loggedInUser.username, 
                userAvatar: loggedInUser.avatar
            })
            console.log('Created message', res.data)
            // add message to room
            try {
                const resp = await axios.patch(`/api/rooms/${userInRoom._id}/addMessage`, {
                    messages: res.data.doc._id
                })
                console.log('Message pushed to room', resp.data)
            } catch (error) {
                console.log(error)
            }

        } catch (err) {
            console.log(err.response)
        }
    }
    // const {data} = useSWR(`/api/rooms/${userInRoom._id}/room-messages`)

    const handleSubmit= e => {
        e.preventDefault();
        // , {...data, messages: message}, false
        mutate(`/api/rooms/${userInRoom._id}/room-messages`)
        createMessage();
        setMessage('');
        trigger(`/api/rooms/${userInRoom._id}/room-messages`)
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