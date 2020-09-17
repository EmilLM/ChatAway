import React, {useEffect, useRef, useContext} from "react";
import DirectChatMessage from './DirectChatMessage'

import DirectChatForm from './DirectChatForm'
import DataError from "@/General/DataError"
import ChatAppContext from 'components/General/ChatAppContext'
import UserContext from '@/General/UserContext'
import RoomDetails from "./RoomDetails";
import SidebarToggleButton from "@/General/SidebarToggleButton"

import Avatar from '@material-ui/core/Avatar';
import {CircularProgress} from '@material-ui/core';
import useSWR from 'swr'

const DirectChatWindow = () => {

    const {loggedInUser} = useContext(UserContext)
    const {userInChat, leaveChat} = useContext(ChatAppContext);
    const {data, error} = useSWR(`/api/chat/${userInChat._id}/chat-messages`)
    

    const el = useRef(null);
    useEffect(()=> {
        if (el.current) {
            el.current.scrollIntoView();
        }
    }, [data]);
    // cleanup
    useEffect( ()=> {
        return () => leaveChat(userInChat._id)
    }, [userInChat])

    // to avoid username display on consecutive messages from the same user
    let lastSender = undefined;

    if (error) return <DataError/>
    if (data) return (  
        <>
            <ChatInfo />
            <div className="joinRoom">
                <div className="messageList">
                    {data?.chatMessages.map(message => {
                        // to avoid username display on consecutive messages from the same user + different color bubble
                        const showName = !lastSender || message.user !== lastSender; 
                        lastSender = message.user
                        const otherUserMessage = message.user !== loggedInUser?.username;
                        return (
                            <div key={message._id} id={'el'} ref={el}>
                                <DirectChatMessage
                                    otherUserMessage={otherUserMessage}
                                    showName={showName}
                                    message={message}
                                    data={data}                       
                                />
                            </div>
                        )        
                    })}
                </div>
            </div>
            <DirectChatForm  data={data}/>  
        </>
    )
    return <div className="loading"><CircularProgress /></div>
}

export default DirectChatWindow;

const ChatInfo = () => {
    const {loggedInUser} = useContext(UserContext)
    const {userInChat} = useContext(ChatAppContext);
    const chatWith = userInChat?.participants.filter( (name) =>  name !== loggedInUser?.username) 
    const {data} = useSWR(`/api/users/${chatWith}/find-user`); 

    return (
        <div className="roomInfo">
            <SidebarToggleButton />
            <div className="chatUserInfo">
                <Avatar src={`/uploads/userAvatars/${data?.user.avatar}`} 
                            alt="user-image" className="user-image" type="text/plain">
                            {data?.user.username[0]}
                </Avatar>
                <h2>{chatWith}</h2>
            </div> 
            
            <RoomDetails/>
        </div>
    )
}