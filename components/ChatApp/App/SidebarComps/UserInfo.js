import React, {useContext, useEffect} from "react";
import UserContext from "@/General/UserContext";
import UserOptions from "./UserOptions"
import Avatar from '@material-ui/core/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import Link from "next/link";

export default function UserInfo() {

    
    const {loggedInUser} = useContext(UserContext);
    
    
    if (!loggedInUser) return (
        <div className="userInfo">
            <Skeleton variant="rect" width={110} height={45}/>
        </div>
    )
    
    if (loggedInUser) return (
        <div className="userInfo" >
            <Link href="/user-profile/main" passHref>
                <a>
                    
                    <Avatar src={`/uploads/userAvatars/${loggedInUser.avatar}`} 
                        alt="user-image" className="user-image">
                        {loggedInUser.username[0]}
                    </Avatar>
                    <span>{loggedInUser.username}</span>
                </a>
            </Link> 
            <UserOptions/>
        </div>
    )
}

