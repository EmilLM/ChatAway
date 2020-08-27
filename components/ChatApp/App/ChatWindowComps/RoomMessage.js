import React, {useState, useContext} from "react";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatAppContext from 'components/General/ChatAppContext'
import axios from 'axios';
import {mutate} from 'swr'

 const DirectChatMessage = React.memo((props) => {
    
    const {userInRoom} = useContext(ChatAppContext);
    const {showName, username, text, avatar, messageId, data} = props;
    const [hover, setHover] = useState(false);
    
   
    const deleteMessage = async () => {

        const {roomMessages} = data;
        const remainingMessages= roomMessages.filter( el => el._id !== messageId)
        mutate(`/api/rooms/${userInRoom._id}/room-messages`, {roomMessages: remainingMessages}, false)
        
        try {
            await axios.delete(`/api/messages/${messageId}`)
            // remove messageId from chat
            await axios.patch(`/api/rooms/${userInRoom._id}/removeMessage`, {
                messages: messageId
            });
        } catch(err) {
            // revert mutate changes on error
            mutate(`/api/rooms/${userInRoom._id}/room-messages`, {roomMessages}, false)
            console.log('Delete message error', err)
        }
        mutate(`/api/rooms/${userInRoom._id}/room-messages`) 
    }
        
       
          
  
    

    return (
        <>
            <div 
            className="message" 
            onMouseEnter={ ()=>setHover(true)} 
            onMouseLeave={ ()=>setHover(false)}
            >
                {showName && <div className="sender">
                    <span><Avatar src={`/uploads/userAvatars/${avatar}`} alt="user-avatar"  /></span>
                    {username}
                </div>}
                <div className={showName ? 'text speech-bubble': 'text'}>
                    {text}
                    {/* display message options only on your messages not everyones */}
                    <div className="messageOptions">
                        {hover &&
                            <>
                                <IconButton >
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={()=>deleteMessage()}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }  
                    </div>
                </div>
            </div>
            
        </>
    )
})

export default DirectChatMessage;