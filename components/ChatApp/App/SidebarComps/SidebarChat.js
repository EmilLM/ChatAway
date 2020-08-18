import React from "react";
import UserInfo from "../SidebarComps/UserInfo";
import RoomTab from "../SidebarComps/RoomTab";
import DirectChatTab from "../SidebarComps/DirectChatTab";
import FriendsTab from "./FriendsTab"
import SiderbarToggled from "./SidebarToggled";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';


const SidebarChat = ({handleToggle, toggleBar}) => {
    if (!toggleBar) return ( 
        <Grid component={Box} item sm={3} xs="auto" id="appSidebar" display={{ xs: 'none', sm: 'block' }}>
            <div className="sidebarContainer"> 
                <UserInfo/>
                <RoomTab/>
                <DirectChatTab/>
                <FriendsTab/>
             </div>
        </Grid>
    )
    if (toggleBar) return (
        <SiderbarToggled handleToggle={handleToggle} toggleBar={toggleBar}/>
    )
}
 
export default SidebarChat;