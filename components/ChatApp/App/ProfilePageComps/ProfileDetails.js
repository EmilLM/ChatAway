import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import PublishIcon from '@material-ui/icons/Publish';
import axios from 'axios';
import {mutate, trigger} from 'swr';


const ProfileDetails = ({data}) => {

    const date = data?.doc.createdAt;
    const displayDate = new Date(date).toDateString();

    const [file, setFile] = useState();
    const [filename, setFilename] = useState('Change avatar image')
  

    const handleChange = e => {
        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name)
    }
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('avatar', file);

        try {
            const res = await axios.patch(`/api/users/updateMe`, formData, {
                headers: { 'Content-Type': 'multipart/form-data'}
            })
            console.log('Avatar changed', res.data);
            
        } catch (err) {
            console.log(err.response)
        }
        mutate('api/users/me');
        trigger('api/users/me');
        setFile(null);
        setFilename("Change avatar image");
    }
    
    return ( 
        <div className="details">
            <div>
                <Avatar src={`/uploads/userAvatars/${data.doc.avatar}`} 
                    alt="user-image" className="profileImage">
                    {data.doc.username[0]}
                </Avatar>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="avatar"  className="uploadAvatar">{filename}
                        <input type="file" id="avatar" accept="image/*" name="avatar" style={{display: "none"}} 
                        onChange={handleChange} 
                        />
                    </label>
                    <IconButton type="submit" disabled={!file}  color="primary">
                        <PublishIcon/>
                    </IconButton>
                </form>
            </div>
            
            <div className="userDetails">
                <div>Name: <span>{data.doc.username}</span></div>
                <div>Email: <span>{data.doc.email}</span></div>
                <div>Member since: <span>{displayDate}</span></div>
            </div>    
        </div>
     );
}
 
export default ProfileDetails;

