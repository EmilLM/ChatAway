import React, {useState, useEffect, useContext} from "react";


import UserInfo from "../SidebarComps/UserInfo";
import RoomTab from "../SidebarComps/RoomTab";
import DirectChatTab from "../SidebarComps/DirectChatTab";
import FriendsTab from "./FriendsTab"

import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';

// import MenuOpenIcon from '@material-ui/icons/MenuOpen';
// startIcon={<MenuOpenIcon />}


const SiderbarToggled = ({toggleBar, handleToggle}) => {
    return ( 
        <>
            <Backdrop className="backdrop" open={toggleBar} onClick={handleToggle}>
                <Button variant="contained" color="primary" 
                    onClick={handleToggle} className="closeSidebar"
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