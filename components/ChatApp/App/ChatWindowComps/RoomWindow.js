import React, {useEffect, useRef, useContext} from "react";
import RoomMessage from './RoomMessage'
import useSWR from 'swr'
import RoomForm from "./RoomForm";
import {CircularProgress} from '@material-ui/core';
import ChatAppContext from 'components/General/ChatAppContext';
import DataError from "@/General/DataError"

const RoomWindow = () => {
    const {userInRoom, leaveRoom} = useContext(ChatAppContext)
    const {data, error} = useSWR(`/api/rooms/${userInRoom._id}/room-messages`)
    
    console.log('room messages', data)

    // let orderedMessages;
    // if (data) {
    //     // orderedMessages = messages.doc.sort(function(a, b) {
    //     orderedMessages = data?.roomMessages.sort(function(a, b) {
    //         a = new Date(a.createdAt);
    //         b = new Date(b.createdAt);
    //         return a<b ? -1 : a>b ? 1 : 0;
    //     });
    // }
    
    const el = useRef(null);
    useEffect(()=> {
        if (el.current) {
            el.current.scrollIntoView();
        }
        
    }, [data]);
    // cleanup
    useEffect(()=> {
        return () => leaveRoom(userInRoom._id)
    }, []);
    // to avoid username display on every message in a group from the same user
    let lastSender = undefined;

    if (error) return <DataError/>
    if (data) return (  
        <>
            <div className="joinRoom">
                <div className="messageList">
                <div className="roomDescription">{userInRoom.description}</div>
                    {data?.roomMessages.map(message => {
                        // to avoid username display on every message in a group from the same user
                        const showName = !lastSender || message.user !== lastSender; 
                        lastSender = message.user
                        return (
                            <div key={message._id} id={'el'} ref={el}>
                                <RoomMessage 
                                    showName={showName}
                                    username={message.user}
                                    text={message.text} 
                                    avatar={message.userAvatar}
                                    messageId={message._id}     
                                    data={data}                   
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
            <RoomForm data={data} />  
        </>
    )
    return (
        <div className="loading">
            <CircularProgress />
        </div>
    )
}
 
export default RoomWindow;