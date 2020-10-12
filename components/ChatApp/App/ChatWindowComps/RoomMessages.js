
import React , {useContext, useEffect, useRef} from 'react';
import RoomMessage from './RoomMessage'
import useSWR from 'swr'
import {CircularProgress} from '@material-ui/core';
import ChatAppContext from '@/General/ChatAppContext';
import UserContext from '@/General/UserContext';


const RoomMessages = () => {
    
    let lastSender = undefined;
    const {userInRoom, leaveRoom} = useContext(ChatAppContext)
    const {data, error} = useSWR(`/api/rooms/${userInRoom?._id}/room-messages`)
    const {loggedInUser} = useContext(UserContext);

    const el = useRef(null);
    useEffect(()=> {
        if (el.current) {
            el.current.scrollIntoView();
        }  
    }, [data]);
    console.log('Room message window reder')
    if (data) return ( 
        data?.roomMessages.map(message => {
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
        })
    );
    if (!data) return (
        <div className="loading">
            <CircularProgress />
        </div>
    )
}

export default React.memo(RoomMessages);