import React, {useContext, useState} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import UserContext from '@/General/UserContext'
import ChatAppContext from '@/General/ChatAppContext'
import axios from 'axios';
import {mutate, trigger} from 'swr';

const Friend = React.memo(({status, user}) => {
    const [hover, setHover] = useState(false);
    const {loggedInUser} = useContext(UserContext);
    const {startChat} = useContext(ChatAppContext);

    const removeFriend = async (userId) => {
        // remove friend from logged in user
        try {
            await axios.patch(`/api/users/${loggedInUser._id}/removeFriend`, {friends: userId})
            // remove logged in user as friend from target user
            await axios.patch(`/api/users/${userId}/removeFriend`, {friends:  loggedInUser._id })
        } catch (err) {
            console.log('Remove logged user friend error'. err)
        }
    }

    
    return ( 
        <ul
            onMouseEnter={ ()=>setHover(true)} 
            onMouseLeave={ ()=>setHover(false)}
        >
            <li 
                className={"user " + status}
                onMouseDown={ e=> e.preventDefault()}
                onClick={()=>startChat(user.username, user._id)}
            >{user.username}   
            </li>
            {hover && 
            <IconButton 
                className={"closeChat"} 
                onClick={() => {
                    removeFriend(user._id)
                    mutate('/api/users/me');
                    trigger('/api/users/me');
                }} >
                <CloseIcon />
            </IconButton> }  
        </ul>
         
    );
})
 
export default Friend;