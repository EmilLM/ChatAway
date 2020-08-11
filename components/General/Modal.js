import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    height: '50vh',
    width: '400px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
}));

export default function ModalStructure(props) {

const {title, toggle, modal} = props
const classes = useStyles();
  return (
    <Modal
      // aria-labelledby="transition-modal-title"
      // aria-describedby="transition-modal-description"
      className={classes.modal}
      open={modal}
      onClose={toggle}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modal}>
        <div className={classes.paper} id="chatForm">
          <h2 >{title}</h2>
          {props.children}
        </div>
      </Fade>
    </Modal>
  );
}