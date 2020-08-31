import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import CodeIcon from '@material-ui/icons/Code';
import LinkIcon from '@material-ui/icons/Link';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

import Button from '@material-ui/core/Button';

const ChatForm = ({handleSubmit, handleChange, message}) => {
    return ( 
        <div className="messageForm">
            <form onSubmit={handleSubmit}>
                <input className="input" placeholder="Type a message..."
                       type="text"
                       value={message}
                       onChange={handleChange}
                />
               <FormOptions message={message}/>
                
            </form>
        </div>
    );
}
 
export default ChatForm;


const FormOptions = ({message}) => {
    return ( 
        <div className="formOptions">
            <div>
                <IconButton>
                    <FormatBoldIcon/>
                </IconButton>
                <IconButton>
                    <FormatItalicIcon/>
                </IconButton>
                <IconButton>
                    <CodeIcon/>
                </IconButton>
                <IconButton>
                    <LinkIcon/>
                </IconButton>
            </div>
            
            <div>
                <IconButton disabled>
                    <CameraAltIcon/>
                </IconButton>
                <IconButton>
                    <AttachFileIcon/>
                </IconButton>
                <IconButton>
                    <EmojiEmotionsIcon/>
                </IconButton>
                <Button type="submit" className={"submitButton"} disabled={!message} style={{background: message && "rgb(170, 111, 111)"}}>
                    <SendIcon/>    
                </Button>
            </div>
        
        </div>
    );
}
 
