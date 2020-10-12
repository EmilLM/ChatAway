import React, {useState, useEffect, useContext} from "react";
import axios from 'axios';
import useSWR, {mutate, trigger} from 'swr';
import ChatAppContext from '@/General/ChatAppContext';
import Grid from '@material-ui/core/Grid';
import SidebarChat from "@/SidebarComps/SidebarChat";
import ChatWindow from "@/ChatWindowComps/ChatWindow";
import Router from "next/router";
import Head from 'next/head';
import DataError from "@/General/DataError"

const ChatAway = React.memo(({loginStatus, roomsData, loggedInUser, handleLogout}) => {
    
    const {data: rooms, error: roomsError} = useSWR('/api/rooms' ,{initialData: roomsData});
    // const {data, error} = useSWR('/loggedIn');
   
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
            setUserInRoom(false)
            console.log('Left room', res.data)
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
            console.log("created chat", res.data)
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
            const res = await axios.patch(`/api/chat/${chatId}/removeUser`, {activeUsers: loggedInUser._id});
            setUserInChat(false);
            console.log('Left chat', res.data)
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
            // if theres no existing chat history, create it  
            if (res.data.chat === "No chat history") {
                // create chat 
                const resp = await axios.post('/api/chat', {
                    participants: [loggedInUser.username, username],
                    name: loggedInUser.username + '--' + username     
                })
                console.log('created chat', resp.data)
                // open chat and add chat to logged in user
                joinChat(resp.data.doc._id)
           
                // add chat to target user
                await axios.patch(`/api/users/${userId}/addChat`, {chats: resp.data.doc._id, })
            } else {
                // open chat and add chat to logged in user
                joinChat(res.data.chat._id)
                console.log('Check else')
                // add chat to target user
                await axios.patch(`/api/users/${userId}/addChat`, {chats: res.data.chat._id, })
            }
        } catch (err) {
            console.log('Start chat err', err)
        }
        
    }
    const logoutAndLeaveChats = () => {
        handleLogout()  
        if (userInRoom) leaveRoom(userInRoom._id)
        if (userInChat) leaveChat(userInChat._id)
    }

    // toggle the Sidebar on xs
    const [toggleBar, setToggleBar] = useState(false);
    const handleToggleBar = () => setToggleBar(!toggleBar);

    useEffect( () => {
        if (loginStatus === "logged-out") Router.replace('/index');
        // if (loginStatus === "No logged in user!" || "User login expired!") Router.replace('/login')
    }, [loginStatus])

    if (roomsError || joinError) return <DataError/>
    return (
        <>
            <Head>
                <title>ChatAway!</title>
            </Head>
            <ChatAppContext.Provider value={{allRooms: rooms?.doc,  joinRoom, leaveRoom, userInRoom, joinError, deleteRoom, 
                startChat, removeChat, joinChat, userInChat, leaveChat, handleToggleBar, setToggleBar, logoutAndLeaveChats}}>

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

    return { props: {roomsData} }
}

