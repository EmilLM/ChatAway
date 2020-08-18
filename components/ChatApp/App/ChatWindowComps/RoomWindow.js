import React, {useEffect, useRef, useContext} from "react";
import Message from './Message'
import useSWR from 'swr'
import RoomForm from "./RoomForm";
import {CircularProgress} from '@material-ui/core';
import ChatAppContext from 'components/General/ChatAppContext';
import DataError from "@/General/DataError"

const RoomWindow = () => {
    const {userInRoom, leaveRoom} = useContext(ChatAppContext)
    const {data: messages, error} = useSWR(`/api/rooms/${userInRoom._id}/room-messages`)
    

    let orderedMessages;
    if (messages) {
        // orderedMessages = messages.doc.sort(function(a, b) {
        orderedMessages = messages.roomMessages.sort(function(a, b) {
            a = new Date(a.createdAt);
            b = new Date(b.createdAt);
            return a<b ? -1 : a>b ? 1 : 0;
        });
    }
    
    const el = useRef(null);
    useEffect(()=> {
        if (el.current) {
            el.current.scrollIntoView();
        }
        
    }, [messages]);
    // cleanup
    useEffect(()=> {
        return () => leaveRoom(userInRoom._id)
    }, []);

    if (error) return <DataError/>
    if (orderedMessages) return (  
        <>
            <div className="joinRoom">
                <div className="messageList">
                <div className="roomDescription">{userInRoom.description}</div>
                    {orderedMessages?.map((message, index) => {
                        return (
                            <div key={index} id={'el'} ref={el}>
                                <Message username={message.user}
                                    text={message.text} 
                                    messageId={message._id}
                                    avatar={message.userAvatar}                        
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <RoomForm />  
        </>
    )
    return <div className="loading"><CircularProgress /></div>
}
 
export default RoomWindow;