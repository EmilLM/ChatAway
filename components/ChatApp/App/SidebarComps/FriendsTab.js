import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faChevronDown, faPlus} from "@fortawesome/free-solid-svg-icons";

import Modal from "components/General/Modal";
import CreateChat from "./CreateChat"
import Friend from "./Friend"
import useSWR from 'swr';

// Later turn into a friends tab
const FriendsTab = () => {
    const [toggleTab, setToogleTab] = useState(true);
    const handleToggle = () => setToogleTab(!toggleTab);

    const [toggleModal, setToggleModal] = useState(false);
    const handleModal = () => setToggleModal(!toggleModal);

    const {data, error} = useSWR('/api/users/me');
    const friends = data?.doc.friends;
    return ( 
        <>
            <div className="sidebarTab">
                <a href="#" onClick={handleToggle} className="tabLink">
                            <i><FontAwesomeIcon icon={faChevronDown} className={toggleTab?"open":"revert"}/></i>
                            Friends
                </a>
                <i><FontAwesomeIcon icon={faPlus} onClick={handleModal}/></i>
            </div>

            <Modal toggle={handleModal} modal={toggleModal} title={"Find new ChatAway friends"}>
                <CreateChat/>
            </Modal>
            {toggleTab && 
                <ul className="users">
                    {
                        friends?.length === 0
                        ?<div>Find some friends!</div>
                        :friends?.map( (user) => {
                            const status =  user.connected ? "online" : "offline"
                            return <Friend key={user._id} status={status} user={user}/>
                        })
                    }
                </ul>
            }
        </>
     );
}
 
export default FriendsTab;