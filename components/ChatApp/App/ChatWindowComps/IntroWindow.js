import React, {useContext} from "react";
import ChatAppContext from '@/General/ChatAppContext';
import UserContext from '@/General/UserContext';
import RoomWindow from './RoomWindow';
import DirectChatWindow from "./DirectChatWindow";
import DataError from "@/General/DataError"
import SidebarToggleButton from '@/General/SidebarToggleButton'

export default function IntroWindow() {
    const {userInRoom, joinError, userInChat} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);

    if (joinError) return <DataError/>
    if (userInRoom) return <RoomWindow />
    if (userInChat) return <DirectChatWindow />

    return (
        <>
            <SidebarToggleButton />
            <div className="defaultWindow">
                <img src='/ChatAway.png' alt="logo"/>
                <h1>Hello {loggedInUser?.username}!</h1>
                <div>Create or join a room, or find a friend to start chatting.</div>
            </div>
        </>
    )
}