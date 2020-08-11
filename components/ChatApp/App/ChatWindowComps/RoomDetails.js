import React from 'react';
import InfoIcon from '@material-ui/icons/Info';
import Button from '@material-ui/core/Button';


const RoomDetails = () => {
  return ( 
    <Button
      variant="outlined"
      color="primary"
      // className="customButton"
      startIcon={<InfoIcon />}
      style={{border: 'none'}}
    >
      Details
    </Button>
  );
}
 
export default RoomDetails;