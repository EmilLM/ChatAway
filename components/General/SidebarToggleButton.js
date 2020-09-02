import React, {useContext} from 'react';
import Hidden from '@material-ui/core/Hidden';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import ChatAppContext from 'components/General/ChatAppContext'

const SidebarToggleButton = () => {
    const {handleToggleBar} = useContext(ChatAppContext)
    return ( 
        <Hidden smUp>
            <IconButton onClick={handleToggleBar} style={{margin: '10px'}}>
                <MenuIcon/>
            </IconButton>
        </Hidden> 
    );
}
 
export default SidebarToggleButton;