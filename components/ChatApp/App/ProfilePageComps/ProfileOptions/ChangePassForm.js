import React, { useState, useEffect } from 'react';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import FormikInput from "components/General/FormikInput";
import {Button, CircularProgress} from '@material-ui/core';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import axios from 'axios';

const ChangePassForm = () => {
   
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [passChanged, setPassChanged] = useState(false);

    const changePassword =  async (passwordCurrent, passwordNew, passwordConfirm) => {
        setIsLoading(true);
        try {
            const res = await axios.patch('/api/users/changePassword', {
               passwordCurrent,
               password: passwordNew,
               passwordConfirm, 
            })
            console.log(res.data);
            setIsLoading(false);
            setPassChanged(res.data); 
        } catch (err) {
            setIsLoading(false) 
            setError(err)
        }
    }
    return (
        <div className="profileOptions"> 
            <div className="editText">
                <LockOpenIcon/>
                <div>Change your password:</div>
            </div>
            <Formik initialValues={{
                passwordCurrent: '',
                passwordNew: '',
                passwordConfirm: ''
                }}
                validationSchema={Yup.object({
                passwordCurrent: Yup.string()
                    .required('Required'),
                passwordNew: Yup.string()
                    .required('Required')
                    .min(8, 'Password must be 8+ characters!'),
                passwordConfirm: Yup.string()
                    .required('Required')
                    .min(8, 'Password must be 8+ characters!')
                })}
                onSubmit={(values, { resetForm }) => {
                    changePassword(values.passwordCurrent, values.passwordNew, values.passwordConfirm);
                    resetForm();
                    // setTimeout(() => {
                    //     alert(JSON.stringify(values, null, 2));
                    //     setSubmitting(false);
                    // }, 500);
                }}
            >
                <Form>
                    <FormikInput name="passwordCurrent" label="Current password" type="password"/>
                    <FormikInput name="passwordNew" label="New password" type="password"/>
                    <FormikInput name="passwordConfirm" label="Repeat new password" type="password"/>
                    
                    {error?<small>{error.data.message}!</small>:null}
                    {passChanged && !error && !isLoading? <div className="edited">Password change succesful!</div> : null}
                    <Button variant="contained" color="primary" type="submit" className="customButton" disabled={isLoading}>
                        {!isLoading?"Submit":<CircularProgress style={{color:"white"}} size={25.5}/>}
                    </Button>
        
                </Form>
            </Formik>
        </div>
     );
}
 
export default ChangePassForm;
