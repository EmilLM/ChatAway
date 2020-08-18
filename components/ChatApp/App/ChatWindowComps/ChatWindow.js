import React, {useState, useEffect, useContext} from "react";
import ChatAppContext from 'components/General/ChatAppContext'
import InfoWindow from "./InfoWindow";
import IntroWindow from "./IntroWindow";


import Grid from '@material-ui/core/Grid';


const ChatWindow = ({handleToggle}) => {
    
    return ( 
        <Grid item sm={9} xs={12} id ="chatWindow">
            <InfoWindow toggle={handleToggle}/>
            <IntroWindow/>
        </Grid>
    );
}
 
export default ChatWindow;