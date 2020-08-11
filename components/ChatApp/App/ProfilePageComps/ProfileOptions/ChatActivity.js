import React, { useState } from 'react';
import HistoryIcon from '@material-ui/icons/History';

const ChatActivity = () => {
    return ( 
        <div className="profileOptions"> 
            <div className="editText">
                <HistoryIcon/>
                <div>Your recent chat activity:</div>
                
            </div>
            <div>Working on it!</div>
        </div>
     );
}
 
export default ChatActivity;