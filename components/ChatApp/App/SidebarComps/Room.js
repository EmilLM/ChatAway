import React, {useState,useContext} from 'react';
import RoomOptions from './RoomOptions';
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';

const RoomsList = ({room, active}) => {

    const { joinRoom} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    const [hover, setHover] = useState(false);
    
    return ( 
        <li  className={"room " + active}
            onMouseEnter={()=>setHover(true)} 
            onMouseLeave={()=>setHover(false)} 
            onDoubleClick={()=>joinRoom(room._id, loggedInUser._id)} 
            onMouseDown={e=>e.preventDefault()}
        >
            # {room.name}
            {hover &&<RoomOptions room={room}/>}
        </li>
    );
}
 
export default RoomsList;