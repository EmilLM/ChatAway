import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Link from "next/link";

const StyledMenuItem = withStyles((theme) => ({
    root: {
      width: '100%',
      '&:hover': {
        borderLeft: "3px solid white",
        paddingLeft: "30px",
      },
    },
  }))(MenuItem);

const SidebarOptions = ({handleState, text, children, link}) => {
    return (  
      <Link href={link}>
        <StyledMenuItem onClick={handleState}>
          <ListItemIcon>
              {children}
          </ListItemIcon>
          <ListItemText primary={text} />
        </StyledMenuItem>
      </Link>
    );
}
 
export default SidebarOptions;