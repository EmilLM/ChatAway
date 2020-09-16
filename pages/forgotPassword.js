import React, {useState} from 'react';
import {Button, CircularProgress} from '@material-ui/core';
import LockOpenSharp from '@material-ui/icons/LockOpenSharp';
import { Formik, Form} from 'formik';
import FormikInput from "@/General/FormikInput";
import * as Yup from 'yup';
import axios from 'axios';
import Head from "next/head";
import Link from "next/link"

const  ForgotPassword = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [forgotPass, setForgotPass] = useState(null);
    const [error, setError] = useState(null);

   
    const forgotPassword = async (email) => {
        setIsLoading(true);
        try {
            const res = await axios.post('/api/users/forgotPassword', {email});
            setForgotPass(res.data);
            setIsLoading(false);
            setError(null)
            console.log(res.data)
        } catch (err) {
            console.log(err.response);
            setError(err.response);
            setIsLoading(false); 
        }
    }

    return (
        <>
            <Head>
                <title>Forgot password</title>
            </Head>
            <div className="intro">
                <LockOpenSharp/>
                <h2>Forgot your password?</h2>
                <Formik initialValues={{email: ''}}
                    validationSchema={Yup.object({
                    email: Yup.string()
                        .email("Invalid email!")
                        .required('Required'),
                    })}
                    onSubmit={(values) => {
                        forgotPassword(values.email)
                    }}
                >
                    <Form style={{height: '30vh'}}>
                        <FormikInput label="Email" name="email" type="text"/>
                        
                        {error
                        ?<small>{error.data.message}</small>
                        :forgotPass
                            ?<small className="edited">Email password reset sent!</small>
                            : null}

                        <Button variant="contained" color="primary" type="submit" className="customButton" disabled={isLoading}>
                            {!isLoading?"Submit":<CircularProgress style={{color:"white"}} size={25.5}/>}
                        </Button>
                        <div className="options links"> 
                            <Link href="/signup">
                                <a href="/signup noButtonStyle">Sign Up</a>
                            </Link>
                            <Link href="/login">
                                <a href="/login noButtonStyle">Sign In</a>
                            </Link>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    );
}



export default ForgotPassword;