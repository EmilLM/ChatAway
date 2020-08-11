import React, {useEffect, useState, useContext} from "react";
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';
import RoomWindow from './RoomWindow';
import DirectChatWindow from "./DirectChatWindow";


export default function IntroWindow() {
    const {userInRoom, joinError, userInChat} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);


    if (joinError) return <h2>Can't join room! Something went wrong!</h2>
    if (userInRoom) return <RoomWindow/>
    if (userInChat) return <DirectChatWindow/>
    return (
    <div className="defaultWindow">
        <img src='/ChatAway.png' alt="logo"/>
        <h1>Hello {loggedInUser?.username}!</h1>
        <div>Create or join a room, or find a friend to start chatting.</div>
    </div>
    )
}