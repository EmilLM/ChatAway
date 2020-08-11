import React, { useContext } from 'react';
import ChatAppContext from "components/General/ChatAppContext";
import { trigger, mutate } from 'swr';

import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';




const StyledMenu = withStyles({
  paper: {
    border: '2px solid #d3d4d5',
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    border: '0.2px solid gray',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
        
      },
    },
  },
}))(MenuItem);

export default function RoomOptions({room}) {


  const {leaveRoom, deleteRoom} = useContext(ChatAppContext)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleDelete = () => {
    deleteRoom(room._id);
    mutate('/api/rooms')
    trigger(`/api/rooms`)
  }

  return (
    <>
        <IconButton
            aria-controls="customized-menu"
            aria-haspopup="true"
            variant="contained"
            color="primary"
            onClick={handleClick}
            className="roomOptions"
        >
            <MoreVertIcon />
        </IconButton>
        <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}     
        >
        <StyledMenuItem onClick={ () => leaveRoom(room._id)} >
            <ListItemIcon onClick={handleClose}>
            <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Leave" />
        </StyledMenuItem>
        <StyledMenuItem>
            <ListItemIcon>
            <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
        </StyledMenuItem>
        <StyledMenuItem onClick={handleDelete}>
            <ListItemIcon>
            <DeleteForeverIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
        </StyledMenuItem>
        </StyledMenu>
    </>
  );
}