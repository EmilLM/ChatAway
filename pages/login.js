import React, {useState, useEffect, useContext} from "react";
import {Button, CircularProgress} from '@material-ui/core';
import LockIcon from '@material-ui/icons/Lock';

import axios from 'axios';
import Router from "next/router";
import UserContext from '@/General/UserContext'

import { Formik, Form} from 'formik';
import * as Yup from 'yup';
import FormikInput from "@/General/FormikInput";
import FormikCheckbox from "@/General/FormikCheckbox"

import Head from "next/head";

const LoginPage = () => {

    const [error, setLoginError ] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {handleAuth, loggedInUser} = useContext(UserContext);

    const authenticate = async (email, password, rememberMe) => {
        setIsLoading(true);
        try {
            const res = await axios ({
                method: 'POST',
                url: '/api/users/login',
                data: {
                    email,
                    password,
                    rememberMe
                }
            });
            if (res.data) Router.push('/chatAway')
            // method for lifting state up to _app.js
            handleAuth(res.data.data);
            setIsLoading(false) 
        } catch(err) {
            console.log(err.response);
            setLoginError(err.response);
            setIsLoading(false) ;
        }
    }
    
    useEffect( () => {
        Router.prefetch('/chatAWay')
        // if (loggedInUser) Router.push('/chatAway')
    }, []);

 
    // const [passMask, setPassMask] = useState(false);
    // const handlePassMask = () => setPassMask(!passMask);

    if (loggedInUser) return <div className="loading"><CircularProgress /></div>
    if (!loggedInUser) return (
        <>
            <Head>
                <title>Login page</title>
            </Head>
            <div className="intro">
                <LockIcon/>
                <h2>ChatAway! Login</h2>
                <Formik initialValues={{
                    email: '',
                    password: '',
                    rememberMe: false
                    }}
                    validationSchema={Yup.object({
                    password: Yup.string()
                        .required('Required')
                        .min(8, 'Password must be 8 characters or longer!'),
                    email: Yup.string()
                        .email("Invalid email!")
                        .required('Required'),
                    rememberMe: Yup.boolean()
                    })}
                    onSubmit={(values) => {
                        authenticate(values.email, values.password, values.rememberMe)
        
                    }}
                >
                    <Form>
                        <FormikInput name="email" type="text" label="Email"/>
                        <FormikInput name="password"  type="password" label="Password"/>
                        <FormikCheckbox name="rememberMe">Remember me?</FormikCheckbox>

                        {error?<small>{error.data.message}!</small>:null}
                    
                        <Button variant="contained" color="primary" type="submit" className="customButton" disabled={isLoading}>
                            {!isLoading?"Submit":<CircularProgress style={{color:"white"}} size={25.5}/>}
                        </Button>
                        
                        <div className="options links"> 
                            <a href="/signup">Create new account!</a>
                            <a href="/forgotPassword">Forgot password?</a>
                        </div>
                    </Form>
                </Formik>
            </div>
        </>
    );
}



export default LoginPage;