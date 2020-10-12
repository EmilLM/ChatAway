
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import FormOptions from "@/General/FormOptions"

const ChatForm = ({handleSubmit, handleChange, message}) => {
    const bgStyle = {
        background: message &&  "rgb(170, 111, 111)"
    }
    return ( 
        <div className="messageForm">
            <form onSubmit={handleSubmit}>
                <Input message={message} handleChange={handleChange} />
                <FormOptions />
                <Button type="submit" className={"submitButton"} disabled={!message} style={bgStyle}>
                    <SendIcon/>    
                </Button>
            </form>
        </div>
    );
}
 
export default ChatForm;

const Input = ({message, handleChange}) => {
    return (  
        <input 
            className="input" 
            placeholder="Type a message..."
            type="text"
            value={message}
            onChange={handleChange}
        />
    );
}
 
