import React, { useState, useEffect } from 'react';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import FormikInput from "components/General/FormikInput";
import FileInput from "@/General/FileInput"
import {Button, CircularProgress} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import axios from 'axios';
import {mutate, trigger} from 'swr';

const EditForm = () => {
   
    const [error, setError] = useState(null);
    const [edited, setEdited] = useState(false);
   
    const updateMe = async (username, email) => {
        try {
            const res = await axios.patch(`/api/users/updateMe`, {
                username,
                email,
            })
            console.log(res.data);
            setEdited(true);
            setError(null)
        } catch (err) {
            setError(err.response)
        }
    }

    return (
        <div className="profileOptions"> 
            <div className="editText">
                <EditIcon/>
                <div>Edit profile:</div>
            </div>
            <Formik initialValues={{
                username: '',
                email: '',
                }}
                validationSchema={Yup.object().shape({
                username: Yup.string()
                    .min(2, 'Username must be 2 characters or longer!'),
                email: Yup.string()
                    .email('Invalid email'),
                })}
                onSubmit={(values, { resetForm}) => {
                    updateMe(values.username, values.email)
                    mutate('api/users/me');
                    trigger('api/users/me');
                    resetForm();
                }}
            >
                <Form>
                    <FormikInput name="username" type="text" label="Name" />
                    <FormikInput name="email" type="text" label="Email"/>
                    {/* <FileInput type="file" name="avatar" label="Select avatar image" className="uploadAvatar" 
                        onChange={ e =>  setFieldValue("avatar", e.target.files[0])}
                    /> */}
                    

                    {error
                    ?<small>{error.data.message}</small>
                    :edited
                        ?<small className="edited">Profile changed!</small>
                        : null}
                        
                    <Button variant="contained" color="primary" type="submit" className="customButton">Save changes!</Button>   
        
                </Form>
            </Formik>
        </div>
     );
}
 
export default EditForm;
