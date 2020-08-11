import React, { useEffect } from 'react';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button'
import Router from 'next/router'
import axios from 'axios';
import {mutate, trigger} from 'swr';

const DeleteAccount = ({data}) => {

    const deleteAccount = async () => {
        const res = await axios.delete(`/api/users/${data.doc._id}`);
        console.log(res.data);
        mutate('api/users/me');
        trigger('api/users/me')
        Router.push('/index')
    }

    // useEffect( () => {
    //     if (!data) Router.push('/index')
    // }, [data])
    
    return ( 
        <div className="profileOptions"> 
            <div className="editText">
                <DeleteForeverIcon/>
                <div>Delete your account:</div>
                
            </div>
            <div>Are you sure you want to delete your account?</div>
            <Button onClick={deleteAccount}>Yes</Button>
            <i>This will redirect you to the home page.</i>
        </div>
     );
}
 
export default DeleteAccount;