import React, {useState, useContext} from "react";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatAppContext from 'components/General/ChatAppContext'
import axios from 'axios';
import {mutate, trigger} from 'swr'

 const DirectChatMessage = React.memo((props) => {
    
    const {userInRoom} = useContext(ChatAppContext);
    const {showName, username, text, avatar, messageId} = props;
    const [hover, setHover] = useState(false);
    
    const handleDelete = () => {
        const deleteMessage = async () => {
            try {
                await axios.delete(`/api/messages/${messageId}`)
            } catch(err) {
                console.log('Delete message error', err)
            }
            // remove messageId from chat
            try {
                const res = await axios.patch(`/api/rooms/${userInRoom._id}/removeMessage`, {
                    messages: messageId
                });
                console.log('removed message from chat',res.data)
            } catch (err) {
                console.log('Remove message from chat error', err)
            }
        }
        deleteMessage();
        mutate(`/api/rooms/${userInRoom._id}/room-messages`)
        trigger(`/api/rooms/${userInRoom._id}/room-messages`)   
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
                                <IconButton onClick={handleDelete}>
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