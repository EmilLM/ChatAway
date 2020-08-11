import React, {useState, useEffect, useContext} from "react";
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { CircularProgress} from '@material-ui/core';
import ProfileDetails from './ProfileDetails'
import DataError from "@/General/DataError"

const ProfileWindow = (props) => {

    const {handleToggle, edit, changePass, activity, 
            deleteUser, data, error} = props;


    if (error) return <DataError/>  
    if (!data) return (
        <Grid item sm={9} xs={12} className ="profileWindow">
            <div className="loading"><CircularProgress /></div>
        </Grid>
    )
    
    return ( 
        <Grid item sm={9} xs={12} >
            <Hidden smUp>
                <IconButton onClick={handleToggle} className="sidebarToggler">
                    <MenuIcon/>
                </IconButton>
            </Hidden>
            <div className ="profileWindow">
                <ProfileDetails data={data} /> 
                {props.children}
            </div>
        </Grid>
    );
}
 
export default ProfileWindow;