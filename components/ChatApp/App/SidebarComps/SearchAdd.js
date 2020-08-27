import React, {useState, useContext} from 'react';
import UserContext from "@/General/UserContext";
import ChatAppContext from 'components/General/ChatAppContext'
import {Button, CircularProgress} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Formik, Form} from 'formik';
import FormikInput from "../../../General/FormikInput";
import Avatar from '@material-ui/core/Avatar';
import useSWR, { mutate, trigger } from 'swr';
import axios from 'axios'

const SearchAdd = () => {
    // const {data, error} = useSWR(`/api/users/?username=${values.username}`);

    const {loggedInUser} = useContext(UserContext);
    const {startChat} = useContext(ChatAppContext)
    
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState(null);
    const [error, setError] = useState(null);

    const searchUsers = async (username) => {
        setIsLoading(true);
        try {
            const res = await axios.get(`/api/users/?username=${username}`);
            setSearch(res.data)
            setIsLoading(false);
        } catch (err) {
            console.log(err.response);
            setError(err.response);
            setIsLoading(false);
        }
    }
  
    const addFriend = async  (userId) => {
        
        try {
            // add friend to logged in user
            await axios.patch(`/api/users/${loggedInUser._id}/addFriend`,{friends: userId})
            // add logged in user as friend to the searched user
            await axios.patch(`/api/users/${userId}/addFriend`, {friends: loggedInUser._id})
        } catch(err) {
            console.log(err.response);
        }
        mutate('/api/users/me')
        trigger('/api/users/me')
    };
   

    
    return (
        <>
            <Formik initialValues={{username: ''}}
                onSubmit={(values, { resetForm }) => {
                    searchUsers(values.username)
                    resetForm();
                }}
            >
                <Form className="chatForm">
                    <FormikInput label="Search for users"
                        name="username" type="text"
                        width="75%" autoComplete="off"
                    />
                    <Button variant="contained" color="primary" type="submit" className="customButton">
                        {!isLoading?<SearchIcon/>:<CircularProgress style={{color:"white"}} size={25.5}/>}
                    </Button> 
                </Form>
            </Formik>

            <ul className="searchResults">
                {search
                    ?search.doc.map( (user, index) => {
                            return (
                                <li key={index} className="searchedUser"> 
                                    <div className="avatar-name">
                                        <Avatar src={`/uploads/userAvatars/${user.avatar}`}  alt="user-image"/>
                                        <div>{user.username}</div>
                                    </div>
                                    <div>
                                        <Button onClick={ () => startChat(user.username, user._id)}>Chat</Button>
                                        <Button onClick={ () => addFriend(user._id)}>Add friend</Button>
                                    </div>
                                </li>
                            )
                        })
                    :error?<small style={{margin: "15px"}}>{error.data.message}!</small>:null
                }
            </ul>
        </>
     );
}
 
export default SearchAdd;