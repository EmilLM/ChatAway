import React, {useEffect, useContext} from "react";
import Avatar from '@material-ui/core/Avatar';


export default function Message({username, text, avatar}) {


    return (
        <div className="message">
            <div className="sender">
                <span><Avatar src={`/uploads/userAvatars/${avatar}`} alt="user-avatar"  /></span>
                {username}
            </div>
            <div className="text speech-bubble">{text}</div>
        </div>

    )
}