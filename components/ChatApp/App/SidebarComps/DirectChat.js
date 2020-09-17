
import React, {useState, useContext} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';
import useSWR, {mutate, trigger} from 'swr';
import Avatar from '@material-ui/core/Avatar';

const DirectChat = ({chat}) => {

    const {removeChat, joinChat, setToggleBar} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);

    const [hover, setHover] = useState(false);

    const chatUsername = chat?.participants.filter( name => name !== loggedInUser?.username)
    const {data: userChat} = useSWR(`/api/users/${chatUsername}/find-user`);
    const status =  userChat?.user.connected ? "online" : "offline";
    
    return (
        <ul 
            onMouseEnter={ ()=>setHover(true)} 
            onMouseLeave={ ()=>setHover(false)}
        >
            <li 
                className={"directChat " + status} 
                onMouseDown={ e=> e.preventDefault()}
                onClick={()=>{joinChat(chat._id), setToggleBar(false) }}
            >
                {/* <Avatar src={`/uploads/userAvatars/${userChat?.user.avatar}`} alt="user-avatar" className="userAvatar" /> */}
                {chatUsername}
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
                </IconButton>
            }
        </ul>
      );
}
 
export default DirectChat;