import React, {useState, useContext} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus} from "@fortawesome/free-solid-svg-icons";
import ChatAppContext from 'components/General/ChatAppContext';
import Modal from "@/General/Modal";
import CreateRoom from "../SidebarComps/CreateRoom"
import Room from './Room';

const RoomTab = () => {
    const [toggleTab, setToogleTab] = useState(true);
    const handleToggle = () => setToogleTab(!toggleTab);

    const [toggleModal, setToggleModal] = useState(false);
    const handleModal = () => setToggleModal(!toggleModal);

    const {allRooms, userInRoom} = useContext(ChatAppContext);
   

    let orderedRooms;
    if (allRooms) orderedRooms = allRooms.sort((a,b)=> a.name.localeCompare(b.name));   

    return ( 
        <>
            <div className="sidebarTab">
                <a href="#" onClick={handleToggle} className="tabLink">
                    <i ><FontAwesomeIcon className={toggleTab?"open":"revert"} icon={faChevronDown}/></i>
                    Rooms 
                </a>
                <i><FontAwesomeIcon icon={faPlus} onClick={handleModal}/></i>
            </div>
        
            <Modal toggle={handleModal} modal={toggleModal} title={"Create room"}>
                <CreateRoom toggleModal={toggleModal} setToggleModal={setToggleModal}/>
            </Modal>

            {toggleTab && 
                <ul className="rooms">
                    {orderedRooms?.map( (room) => {
                        const active = userInRoom?._id === room._id ? "active": '';
                        return <Room room={room} active={active} key={room._id}/>  
                    })}
                </ul>
            
            }
         
        
        </>
     );
}
 
export default RoomTab;