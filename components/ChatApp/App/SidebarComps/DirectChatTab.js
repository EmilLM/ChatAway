import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus} from "@fortawesome/free-solid-svg-icons";
import Modal from "components/General/Modal";
import SearchAdd from "./SearchAdd"
import DirectChat from "./DirectChat"
import useSWR from 'swr';


const DirectChatTab = () => {
    const [toggleTab, setToggleTab] = useState(true);
    const handleToggle = () => setToggleTab(!toggleTab);

    const [toggleModal, setToggleModal] = useState(false);
    const handleModal = () => setToggleModal(!toggleModal);

    const {data, error} = useSWR('/api/users/me');
    const chats = data?.doc.chats;

    
    return ( 
        <>
        <div className="sidebarTab">
            <a href="#" onClick={handleToggle} className="tabLink">
                        <i><FontAwesomeIcon icon={faChevronDown} className={toggleTab?"open":"revert"}/></i>
                        Direct chat
            </a>
            <i><FontAwesomeIcon icon={faPlus} onClick={handleModal}/></i>
        </div>

        <Modal toggle={handleModal} modal={toggleModal} title={"Direct chat"}>
            <SearchAdd/>
        </Modal>
        
        { toggleTab &&
           <div className="directChats">
                {chats?.map( (chat) => {
                    const status =  data.doc.connected ? "online" : "offline"
                    return <DirectChat key={chat._id} chat={chat} status={status}/>
                })}
            </div>
        }
        </>
     );
}
 
export default DirectChatTab;