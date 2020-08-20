import React, {useState} from 'react';
import Grid from '@material-ui/core/Grid';
import SidebarProfile from "components/ChatApp/App/ProfilePageComps/SidebarProfile"
import ProfileWindow from "components/ChatApp/App/ProfilePageComps/ProfileWindow"
import useSWR from 'swr';


const Profile = ({children}) => {

    const [toggleBar, setToggleBar] = useState(false);
    const handleToggle = () => setToggleBar(!toggleBar);

    
    const {data, error} = useSWR('api/users/me');
    console.log('Online:', data?.doc);
    

    
    return (
        <Grid container style={{ border: '2px solid navy'}}>
            <SidebarProfile  handleToggle={handleToggle} toggleBar={toggleBar} />
            <ProfileWindow 
                handleToggle={handleToggle}
                data={data}
                error={error}              
            >
                {children}
            </ProfileWindow>
        </Grid>
    );
}
 
export default Profile;