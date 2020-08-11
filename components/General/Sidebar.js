import React, {useState, useEffect, useContext} from "react";
import SiderbarToggled from "../ChatApp/App/SidebarComps/SidebarToggled";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';


const Sidebar = ({handleToggle, toggleBar, children}) => {
    if (!toggleBar) return ( 
        <Grid component={Box} item sm={3} xs="auto" id="appSidebar" display={{ xs: 'none', sm: 'block' }}>
            <div className="sidebarContainer" >
                {children}
            </div>
        </Grid>
    )
    if (toggleBar) return (
        <SiderbarToggled handleToggle={handleToggle} toggleBar={toggleBar}/>
    )
}
 
export default Sidebar;