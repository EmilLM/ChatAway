import {useContext} from "react";
import UserInfo from "../SidebarComps/UserInfo";
import RoomTab from "../SidebarComps/RoomTab";
import DirectChatTab from "../SidebarComps/DirectChatTab";
import FriendsTab from "./FriendsTab"
import ChatAppContext from '@/General/ChatAppContext'

import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';

const SiderbarToggled = ({toggleBar}) => {
    const {handleToggleBar} = useContext(ChatAppContext)
    return ( 
        <>
            <Backdrop className="backdrop" open={toggleBar} onClick={handleToggleBar}>
                <Button variant="contained" color="primary" 
                    onClick={handleToggleBar} className="closeSidebar"
                >X</Button>
            </Backdrop>
            <Grid  item sm={3}  id="appSidebar" className="sidebarIndex">
                <div className="sidebarContainer">
                    <UserInfo/>
                    <RoomTab/>
                    <DirectChatTab/>
                    <FriendsTab/> 
                </div>
            </Grid>
        </>
     );
}
 
export default SiderbarToggled;