import React, {useContext} from "react";
import ChatAppContext from 'components/General/ChatAppContext';
import UserContext from 'components/General/UserContext';
import RoomDetails from "./RoomDetails";
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';


export default function InfoWindow({toggle}) {
    const {userInRoom, userInChat} = useContext(ChatAppContext);
    const {loggedInUser} = useContext(UserContext);
    let chatWith
    if (userInChat) {chatWith = userInChat.participants.filter( (name) =>  name !== loggedInUser.username) }

    if (userInRoom ) return (
        <div className="roomInfo">
            <Hidden smUp>
                <IconButton onClick={toggle}>
                    <MenuIcon/>
                </IconButton>
            </Hidden> 
            <h2 className="roomName"> # {userInRoom?.name}</h2>
            <RoomDetails/>
        </div>
    )
    if (userInChat) return (
        <div className="roomInfo">
            <Hidden smUp>
                <IconButton onClick={toggle}>
                    <MenuIcon/>
                </IconButton>
            </Hidden>   
            <h2 className="roomName"> {chatWith}</h2>
            <RoomDetails/>
        </div>
    )

    if (!userInRoom || !userInChat) return (
        <Hidden smUp>
            <IconButton onClick={toggle} style={{margin: '10px'}}>
                <MenuIcon/>
            </IconButton>
        </Hidden> 
    )
}
