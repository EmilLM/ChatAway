import React, {useEffect, useContext} from "react";
import Router from 'next/router';

import UserContext from "components/General/UserContext";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import OptionsToggle from './OptionsToggle';
import SidebarOptions from './ProfileOptions/SidebarOptions'
import {Edit, LockOpen, History, DeleteForever, ExitToApp} from '@material-ui/icons';

const SidebarProfile = ({handleToggle, toggleBar}) => {

    const {handleLogout, loggedInUser} = useContext(UserContext);

    // useEffect( () => {
    //     if  (!loggedInUser) Router.push('/index');
    //  })
    
    if (!toggleBar) return ( 
        <Grid component={Box} item sm={3} xs="auto" id="appSidebar" display={{ xs: 'none', sm: 'block' }}>
            <div className="optionsContainer"> 
                
                <SidebarOptions text={"Edit profile"} link={"/user-profile/edit"}>
                    <Edit fontSize="small" />
                </SidebarOptions>
               

                <SidebarOptions text={"Change password"} link={"/user-profile/change-password"}>
                    <LockOpen fontSize="small" />
                </SidebarOptions>

                <SidebarOptions text={"Chat activity"} link={"/user-profile/activity"}>
                    <History fontSize="small" />
                </SidebarOptions>

                <SidebarOptions text={"Logout"} link={"/index"} handleState={handleLogout}>
                    <ExitToApp fontSize="small" />
                </SidebarOptions>

                <SidebarOptions text={"Delete account"} link={"/user-profile/delete"}>
                    <DeleteForever fontSize="small" />
                </SidebarOptions>  
            </div>
        </Grid>
    )
    if (toggleBar) return (
        <OptionsToggle handleToggle={handleToggle} toggleBar={toggleBar}/>
    )
}
 
export default SidebarProfile;