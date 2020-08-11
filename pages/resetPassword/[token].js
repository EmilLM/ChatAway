import React, {useState} from 'react';
import {Button, CircularProgress} from '@material-ui/core';
import LockOpenSharp from '@material-ui/icons/LockOpenSharp';
import { Formik, Form} from 'formik';
import FormikInput from "@/General/FormikInput";
import * as Yup from 'yup';
import axios from 'axios';
import Head from "next/head";
import { useRouter } from 'next/router'

const ResetPassword = () => {

    const router = useRouter();
    const {token} = router.query;
    
    const [isLoading, setIsLoading] = useState(false);
    const [resetPass, setResetPass] = useState(null);
    const [error, setError] = useState(null);

    const resetPassword = async (password, passwordConfirm) => {
        setIsLoading(true);
        try {
            const res = await axios.patch(`/api/users/resetPassword/${token}`, {
                password,
                passwordConfirm
            });
            setResetPass(res.data);
            setIsLoading(false);
        } catch (err) {
            setError(err);
            setIsLoading(false); 
        }
    }

  
    return (
        <>
            <Head>
                <title>Reset password page</title>
            </Head>
            <div className="intro">
                <LockOpenSharp/>
                <h2>Reset password!</h2>
                <Formik initialValues={{
                    password: '',
                    passwordConfirm: '',
                    }}
                    validationSchema={Yup.object({
                    password: Yup.string()
                        .required('Required')
                        .min(8, 'Password must be 8 characters or longer!'),
                    passwordConfirm: Yup.string()
                        .required('Required')
                        .min(8, 'Password must be 8 characters or longer!'),
                    })}
                    onSubmit={(values) => {
                        resetPassword(values.password, values.passwordConfirm)
                    }}
                >
                    <Form style={{height: '30vh'}}>
                        <FormikInput label="Password" name="password" type="password"/>
                        <FormikInput label="Confirm password" name="passwordConfirm" type="password"/>
                        
                        {error
                        ?<small>{error.response.data.message}!</small>
                        :resetPass
                            ?<small className="edited">Password reset succesful!</small>
                            : null}

                        <Button variant="contained" color="primary" type="submit" className="customButton" disabled={isLoading}>
                            {!isLoading?"Submit":<CircularProgress style={{color:"white"}} size={25.5}/>}
                        </Button>
                        <div className="options links"> 
                            <a href="/signup">Sign Up</a>
                            <a href="/login">Sign In</a>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    );
}



export default ResetPassword;