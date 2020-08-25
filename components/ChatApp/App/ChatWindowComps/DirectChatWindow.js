import React, {useState, useEffect, useRef, useContext} from "react";
import DirectChatMessage from './DirectChatMessage'
import useSWR from 'swr'
import DirectChatForm from './DirectChatForm'
import DataError from "@/General/DataError"
import ChatAppContext from 'components/General/ChatAppContext'
import {CircularProgress} from '@material-ui/core';
import UserContext from '@/General/UserContext'

const DirectChatWindow = () => {

    const {loggedInUser} = useContext(UserContext)
    const {userInChat, leaveChat} = useContext(ChatAppContext);
    const {data, error} = useSWR(`/api/chat/${userInChat._id}/chat-messages`)
    
    console.log('chat messages', data)
    // const data = data?.doc.messages.sort(function(a, b) {
    //     a = new Date(a.createdAt);
    //     b = new Date(b.createdAt);
    //     return a<b ? -1 : a>b ? 1 : 0;
    // });
    
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

    // to avoid username display on every message in a group from the same user
    let lastSender = undefined;

    if (error) return <DataError/>
    if (data) return (  
        <>
            <div className="joinRoom">
                <div className="messageList">
                    {data?.chatMessages.map(message => {
                        // to avoid username display on every message in a group from the same user + different color bubble
                        const showName = !lastSender || message.user !== lastSender; 
                        lastSender = message.user
                        const otherUserMessage = message.user !== loggedInUser?.username;
                        return (
                            <div key={message._id} id={'el'} ref={el}>
                                <DirectChatMessage
                                    otherUserMessage={otherUserMessage}
                                    showName={showName}
                                    username={message.user}
                                    text={message.text} 
                                    avatar={message.userAvatar} 
                                    messageId={message._id}                       
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
// DirectChatWindow.whyDidYouRender = true; 
export default DirectChatWindow;