
import React, {useState, useContext} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';
import {mutate, trigger} from 'swr';

const DirectChat = ({chat, status}) => {

    const {removeChat, joinChat} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);

    const [hover, setHover] = useState(false);

  
    return (
        <ul 
            onMouseEnter={ ()=>setHover(true)} 
            onMouseLeave={ ()=>setHover(false)}
        >
            <li 
                className={"directChat " + status} 
                onMouseDown={ e=> e.preventDefault()}
                onClick={()=>joinChat(chat._id)}
            >
                {chat?.participants.filter( (name) =>  name !== loggedInUser?.username)}
            </li>
            {hover && 
            <IconButton 
                className={"closeChat"} 
                onClick={() => {
                    removeChat(chat._id);
                    mutate('/api/users/me');
                    trigger('/api/users/me');
                }} >
                <CloseIcon />
            </IconButton>}
        </ul>
      );
}
 
export default DirectChat;