import React from "react";
import Avatar from '@material-ui/core/Avatar';


 const Message = React.memo(({username, text, avatar}) => {


    return (
        <div className="message">
            <div className="sender">
                <span><Avatar src={`/uploads/userAvatars/${avatar}`} alt="user-avatar"  /></span>
                {username}
            </div>
            <div className="text speech-bubble">{text}</div>
        </div>

    )
})

export default Message;