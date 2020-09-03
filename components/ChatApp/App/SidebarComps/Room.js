import React, {useState,useContext} from 'react';
import RoomOptions from './RoomOptions';
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';

const RoomsList = ({room, active}) => {

    const { joinRoom, setToggleBar} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    const [hover, setHover] = useState(false);
    
    return ( 
        <ul className={active}
            onMouseEnter={()=>setHover(true)} 
            onMouseLeave={()=>setHover(false)}
        >
            <li  
                className={"room"} 
                onClick={()=>{joinRoom(room._id, loggedInUser._id), setToggleBar(false)}} 
                onMouseDown={e=>e.preventDefault()}
            >
                 # {room.name}   
            </li>
            {hover &&<RoomOptions room={room}/>}
        </ul>
        
    );
}
 
export default RoomsList;