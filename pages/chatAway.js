import React, {useState, useEffect, useContext} from "react";
import axios from 'axios';
import useSWR, {mutate, trigger} from 'swr';
import ChatAppContext from 'components/General/ChatAppContext';
import Grid from '@material-ui/core/Grid';
import SidebarChat from "components/ChatApp/App/SidebarComps/SidebarChat";
import ChatWindow from "components/ChatApp/App/ChatWindowComps/ChatWindow";
import Router from "next/router";
import Head from 'next/head';
import DataError from "@/General/DataError"

const ChatAway = React.memo(({loginStatus, roomsData, loggedInUser}) => {
    
    const {data: rooms, error: roomsError} = useSWR('/api/rooms', {initialData: roomsData});
    const {data , error: userError} = useSWR('/api/users/me');
    
    const [userInRoom, setUserInRoom] = useState(null);
    const [userInChat, setUserInChat] = useState(null);
    const [joinError, setJoinError] = useState(null);

    const joinRoom = async (roomId, userId) => {
        try {   
            const res = await axios.patch(`/api/rooms/${roomId}/join`, {users: userId})
            setUserInRoom(res.data.doc);
            console.log('User in room:', res.data.doc)
        } catch(err) {
            console.log(err.response);
            setJoinError(err.response);
        }
    }

    const leaveRoom = async (roomId) => {
        try {
            const res = await axios.patch(`/api/rooms/${roomId}/leave`, {users: loggedInUser._id})
            console.log('Left room')
            setUserInRoom(false)
        } catch(err) {
            // add error handling
            console.log(err.response)
        }
    }

    const deleteRoom = async (roomId) => {
        try {
            const res = await axios.delete(`/api/rooms/${roomId}`)
            setUserInRoom(false);
        } catch (err) {
             // add error handling
            console.log(err.response);
        }
    }

    // createChat
    const createChat = async (username) => {
        try {
            const res = await axios.post('/api/chat', {
                participants: [loggedInUser.username, username],
                name: loggedInUser.username + '--' + username     
            })
        } catch (err) {
            console.log('Create direct chat error', err.response)
            setJoinError(err.response)
        }
    }
   
    // loggedInUser enters chat
    const joinChat = async (chatId) => {
        try {
            // add loggedInUser to chat
            const res = await axios.patch(`/api/chat/${chatId}/addUser`, {activeUsers: loggedInUser._id})
            setUserInChat(res.data.doc);

            // Add chat to loggedInUser
            await axios.patch(`/api/users/${loggedInUser._id}/addChat`, {chats: chatId});
            
            mutate('/api/users/me');
            trigger('api/users/me')
            setUserInRoom(false);
            // console.log('User active in chat:', res.data.doc);

        } catch(err) {
            console.log(err);
            setJoinError(err.response);

        }
    }

    const leaveChat = async (chatId) => {
        try {
            await axios.patch(`/api/chat/${chatId}/removeUser`, {activeUsers: loggedInUser._id});
            console.log('Left chat')
            setUserInChat(false);
        } catch(err) {
            console.log('Left chat error', err)
        }
    }

    // closing chat 
    // do not want to delete chat as it deletes chat history
    const removeChat = async (chatId) => {
        try {
            const res = await axios.patch(`/api/users/${loggedInUser._id}/removeChat`, {chats:  chatId})
            console.log('chat removed', res.data)
            setUserInChat(false);
        } catch(err) {
            console.log(err);
        }   
    }
    
    const startChat = async (username, userId) => {
        // find chat based on your and friend's name
        try {
            const res = await axios.get(`/api/chat/${username}/findChat`)
            console.log('Found chat:', res.data)

            // open chat and add chat to logged in user
           joinChat(res.data.chat._id)
            
            // add chat to target user
            await axios.patch(`/api/users/${userId}/addChat`, {chats: res.data.chat._id, })
           
        } catch (err) {
            console.log(err.response)
            // if theres no existing chat history, create it
            createChat(username)    
            
        }
        
    }


    // toggle the Sidebar on xs
    const [toggleBar, setToggleBar] = useState(false);
    const handleToggleBar = () => setToggleBar(!toggleBar);

    useEffect( () => {
        if (loginStatus === "logged-out") {
            Router.push('/index');
          }
    }, [loginStatus])

    if (roomsError || userError) return <DataError/>
    return (
        <>
            <Head>
                <title>ChatAway!</title>
            </Head>
            <ChatAppContext.Provider value={{allRooms: rooms?.doc,  joinRoom, leaveRoom, userInRoom, joinError, deleteRoom, 
                startChat, removeChat, joinChat, userInChat, leaveChat, handleToggleBar, setToggleBar }}>

                <Grid container style={{ border: '2px solid navy'}}>
                    <SidebarChat handleToggleBar={handleToggleBar} toggleBar={toggleBar}/>
                    <ChatWindow />
                </Grid>

            </ChatAppContext.Provider>
        </>
    
    );
})

export default ChatAway;

export async function getServerSideProps() {
    const r = await axios('/api/rooms');
    const roomsData = r.data;

    // const res = await axios('/api/users/me');
    // const friendsData= res.data.friends;

    // const response = await axios(`/api/rooms/${userInRoom?._id}/room-messages`);
    // const messagesData = response.data
    return { props: { roomsData} }
}

