import React, {useEffect, useRef, useContext} from "react";
import Message from './Message'
import useSWR from 'swr'
import DirectChatForm from './DirectChatForm'
import DataError from "@/General/DataError"
import ChatAppContext from 'components/General/ChatAppContext'
import {CircularProgress} from '@material-ui/core';

const DirectChatWindow = () => {

    const {userInChat, leaveChat} = useContext(ChatAppContext);
    const {data, error} = useSWR(`/api/chat/${userInChat._id}`)
  
    let orderedMessages;
    if (data) {
        orderedMessages = data.doc.messages.sort(function(a, b) {
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
    }, [data]);
    // cleanup
    useEffect( ()=> {
        return () => leaveChat(userInChat._id)
    }, [userInChat])

    if (error) return <DataError/>
    if (orderedMessages) return (  
        <>
            <div className="joinRoom">
                <div className="messageList">
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
            <DirectChatForm />  
        </>
    )
    return <div className="loading"><CircularProgress /></div>
}
 
export default DirectChatWindow;