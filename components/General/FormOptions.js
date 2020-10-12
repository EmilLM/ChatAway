import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import CodeIcon from '@material-ui/icons/Code';
import LinkIcon from '@material-ui/icons/Link';
import CameraAltIcon from '@material-ui/icons/CameraAlt';

const FormOptions = React.memo(() => {
    console.log('Form options render')
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
               
            </div>
        
        </div>
    );
})
 
export default FormOptions;