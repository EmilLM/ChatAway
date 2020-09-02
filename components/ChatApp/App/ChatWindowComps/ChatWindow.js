
import IntroWindow from "./IntroWindow";
import Grid from '@material-ui/core/Grid';


const ChatWindow = () => {
    
    return ( 
        <Grid item sm={9} xs={12} id ="chatWindow">
            <IntroWindow />
        </Grid>
    );
}
 
export default ChatWindow;