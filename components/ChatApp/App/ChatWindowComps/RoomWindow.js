import React, {useEffect, useRef, useContext} from "react";
import RoomMessage from './RoomMessage'
import useSWR from 'swr'
import RoomForm from "./RoomForm";
import {CircularProgress} from '@material-ui/core';
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';
import DataError from "@/General/DataError"
import SidebarToggleButton from '@/General/SidebarToggleButton'
import RoomDetails from "./RoomDetails";

const RoomWindow = () => {
    const {loggedInUser} = useContext(UserContext);
    const {userInRoom, leaveRoom} = useContext(ChatAppContext)
    const {data, error} = useSWR(`/api/rooms/${userInRoom._id}/room-messages`)
    
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

    // to avoid username display on consecutive messages from the same user
    let lastSender = undefined;

    if (error) return <DataError/>
    if (data) return (  
        <>  
            <RoomInfo />
            <div className="joinRoom">
                <div className="messageList">
                <div className="roomDescription">{userInRoom.description}</div>
                    {data?.roomMessages.map(message => {
                        // to avoid username display on consecutive messages from the same user
                        const showName = !lastSender || message.user !== lastSender; 
                        lastSender = message.user
                        const otherUserMessage = message.user !== loggedInUser?.username;
                        return (
                            <div key={message._id} id={'el'} ref={el}>
                                <RoomMessage 
                                    showName={showName}
                                    message={message}
                                    otherUserMessage={otherUserMessage}    
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


const RoomInfo = () => {
    const {userInRoom} = useContext(ChatAppContext)
    return (    
        <div className="roomInfo">
            <SidebarToggleButton/>
            <h2 className="roomName"> # {userInRoom?.name}</h2>
            <RoomDetails/>
        </div> 
    )
}