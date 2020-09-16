import React, {useContext} from "react";

import ChatAppContext from "@/General/ChatAppContext";
import Grid from '@material-ui/core/Grid';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import SidebarOptions from './ProfileOptions/SidebarOptions';
import {Edit, LockOpen, History, DeleteForever, ExitToApp} from '@material-ui/icons';


const OptionsToggle = ({handleToggle, toggleBar}) => {

    const {logoutAndLeaveChats} = useContext(ChatAppContext);
    // useEffect( () => {
    //    if  (!loggedInUser) Router.push('/index');
    // })
    return ( 
        <>
            <Backdrop className="backdrop" open={toggleBar} onClick={handleToggle}>
                <Button variant="contained" color="primary" 
                    onClick={handleToggle} className="closeSidebar"
                >X</Button>
            </Backdrop>
            <Grid  item sm={3}  id="appSidebar" className="sidebarIndex">
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

                    <SidebarOptions text={"Logout"} link={"/index"} handleState={logoutAndLeaveChats}>
                        <ExitToApp fontSize="small" />
                    </SidebarOptions>

                    <SidebarOptions text={"Delete account"} link={"/user-profile/delete"}>
                        <DeleteForever fontSize="small" />
                    </SidebarOptions>  
                </div>
            </Grid>
        </>
     );
}
 
export default OptionsToggle;