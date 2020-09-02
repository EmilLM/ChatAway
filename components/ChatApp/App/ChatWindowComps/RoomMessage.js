import React, {useState, useContext} from "react";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ChatAppContext from 'components/General/ChatAppContext'
import axios from 'axios';
import useSWR, {mutate, trigger} from 'swr'

 const DirectChatMessage = React.memo((props) => {
    
    const {userInRoom} = useContext(ChatAppContext);
    const {showName, message, data, otherUserMessage} = props;
    const [hover, setHover] = useState(false);
    
    const deleteMessage = async () => {
        const {roomMessages} = data;
        const remainingMessages= roomMessages.filter( el => el._id !== message._id)
        mutate(`/api/rooms/${userInRoom._id}/room-messages`, {roomMessages: remainingMessages}, false)
        
        try {
            await axios.delete(`/api/messages/${message._id}`)
            // remove message._id from chat
            await axios.patch(`/api/rooms/${userInRoom._id}/removeMessage`, {
                messages: message._id
            });
        } catch(err) {
            // revert mutate changes on error
            mutate(`/api/rooms/${userInRoom._id}/room-messages`, {roomMessages}, false)
            console.log('Delete message error', err)
        }
        mutate(`/api/rooms/${userInRoom._id}/room-messages`) 
    }
        
    // edit message
    const [edit, setEdit] = useState(false)
    const [editedMessage, setEditedMessage] = useState(message.text)      
    
    const handleSubmit = e => {
        e.preventDefault()
        const editMessage = async () => {
            try {
                const res = await axios.patch(`/api/messages/${message._id}`, {
                    text: editedMessage
                })
                console.log('edited message:', res.data)
            } catch (err) {
                console.log('edit message error', err.response)
            }
        }
        editMessage()
        setEdit(false)
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
                    <span><Avatar src={`/uploads/userAvatars/${message.userAvatar}`} alt="user-avatar"  /></span>
                    {message.user}
                </div>}
                {edit
                    ?<form onSubmit={handleSubmit}> 
                        <input 
                            type="text" 
                            value={editedMessage}
                            onChange={e=>setEditedMessage(e.target.value)}
                        />
                        <div className="editButtons">
                            <button type="submit">Save</button>
                            <button onClick={()=>setEdit(false)}>Cancel</button>
                        </div>
                        
                    </form>
                    :<div 
                        className={showName ? 'text speech-bubble': 'text'}
                        style={{background: otherUserMessage? 'gray': 'cornflowerblue'}}
                        id={otherUserMessage && showName? 'bubble': ''}
                    >
                        {message.text}
                        {/* display message options only on your messages not everyones */}
                        {hover && !otherUserMessage && 
                            <div className="messageOptions">
                                <IconButton onClick={()=>setEdit(!edit)}>
                                    <EditIcon/>
                                </IconButton>
                                <IconButton onClick={()=>deleteMessage()}>
                                    <DeleteIcon />
                                </IconButton>
                            </div>
                        }
                    </div>
                }
            </div>
            
        </>
    )
})

export default DirectChatMessage;