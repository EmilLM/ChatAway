import React, {useContext, useState} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import UserContext from '@/General/UserContext'
import ChatAppContext from '@/General/ChatAppContext'
import axios from 'axios';
import {mutate, trigger} from 'swr';
import Avatar from '@material-ui/core/Avatar';

const Friend = React.memo(({user}) => {
    const [hover, setHover] = useState(false);
    const {loggedInUser} = useContext(UserContext);
    const {startChat, setToggleBar} = useContext(ChatAppContext);

    const status =  user.connected && "offlineAvatar";

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
                className={"friend " + status}
                onMouseDown={ e=> e.preventDefault()}
                onClick={()=>{startChat(user.username, user._id), setToggleBar(false)}}
            > 
                <Avatar src={`/uploads/userAvatars/${user.avatar}`} alt="user-avatar" className="userAvatar" />
                {user.username}   
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
                </IconButton> 
            }   
        </ul>
         
    );
})
 
export default Friend;