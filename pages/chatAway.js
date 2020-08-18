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
    const {data: user , error: userError} = useSWR('/api/users/me');
    
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


    // creating direct chat and adding it to the logged in user (also need to add it to the 2nd user)
    const [addedChat, setAddedChat] = useState(null);
    const createAndAddChat = async (username, userId) => {
        try {
            // check out TWO WAY REFERENCING MONGODB 
            const res = await axios.post('/api/chat', {
                participants: [loggedInUser.username, username],
                name: loggedInUser.username + '--' + username
                
            })
            console.log('Created chat', res.data);
            // Add chat to logged in user
            try {
                const resp = await axios.patch(`/api/users/${loggedInUser._id}/addChat`, {
                    chats: res.data.doc._id,
                });
                setAddedChat(resp.data.doc);
                mutate('/api/users/me');
                trigger('api/users/me')
                console.log('Added chat:', resp.data);
            } catch (err) {
                console.log('Add chat error', err)
            }
            
            // add chat to target user
            try {
                await axios.patch(`/api/users/${userId}/addChat`, {
                    chats: res.data.doc._id,
            
                })
            } catch(err) {
                console.log(err)
            }

            // open chat
            try {
                const r = await axios.patch(`/api/chat/${res.data.doc._id}/addUser`, {
                    activeUsers: loggedInUser._id
                })
                setUserInChat(r.data.doc);
                setUserInRoom(false);
                console.log('User active in chat:', r.data.doc);
            } catch(err) {
                console.log(err);
            }

        } catch (err) {
            console.log('Create direct chat error', err.response)
        }
    };

    
    const addUserToChat = async (chatId) => {
        try {
            const res = await axios.patch(`/api/chat/${chatId}/addUser`, {
                activeUsers: loggedInUser._id
            })
            setUserInChat(res.data.doc);
            setUserInRoom(false);
            console.log('User active in chat:', res.data.doc);
        } catch(err) {
            console.log(err);
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
    const removeChat = async (chatId) => {
        try {
            const res = await axios.patch(`/api/users/${loggedInUser._id}/removeChat`, {
                chats:  chatId
       
            })
            console.log('chat removed', res.data)
            setAddedChat(false);
        } catch(err) {
            console.log(err);
        }   
    }
    
    const friendChat = async (username, userId) => {
        // find chat based on your and friend's name
        try {
            const res = await axios.get(`/api/chat/${username}/findChat`)
            console.log('Found chat:', res.data)

            // Add chat to logged in user
            try {
                const resp = await axios.patch(`/api/users/${loggedInUser._id}/addChat`, {
                    chats: res.data.chat._id 
                });
                setAddedChat(resp.data.chat);
                mutate('/api/users/me');
                trigger('api/users/me')
                console.log('Added chat:', resp.data);
            } catch (error) {
                console.log('Add chat error', error)
            }
            
            // add chat to target user
            try {
                await axios.patch(`/api/users/${userId}/addChat`, {
                    chats: res.data.chat._id,
                    
                })
            } catch(e) {
                console.log(e)
            }
            // open chat
            addUserToChat(res.data.chat._id)
            

        } catch (err) {
            console.log(err.response)
            // if theres no existing chat history, create it
            if (err) {
                createAndAddChat(username, userId)
            }
        }
        
    }


    // toggle the Sidebar on xs
    const [toggleBar, setToggleBar] = useState(false);
    const handleToggle = () => setToggleBar(!toggleBar);

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
                addedChat, friendChat, createAndAddChat, removeChat, addUserToChat, userInChat, leaveChat }}>

                <Grid container style={{ border: '1px solid navy'}}>
                    <SidebarChat handleToggle={handleToggle} toggleBar={toggleBar}/>
                    <ChatWindow handleToggle={handleToggle}/>
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

