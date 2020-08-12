import React, {useState, useEffect, useContext} from "react";
import Head from "next/head";
import Link from "next/link"

import {Button, CircularProgress} from '@material-ui/core';
import PersonAdd from "@material-ui/icons/PersonAdd"
import axios from 'axios';
import Router from "next/router";
import UserContext from 'components/General/UserContext'

import { Formik, Form} from 'formik';
import FormikInput from "components/General/FormikInput";
import * as Yup from 'yup';



const SignupPage = () => {

    const {loggedInUser, handleAuth} = useContext(UserContext);
    const [signupError, setSignupError ] = useState(null);
    const [isLoading, setIsLoading] = useState(false)

    const signup = async (username, email, password, passwordConfirm) => {
        setIsLoading(true);
        try {
            const res = await axios ({
                method: 'POST',
                url: '/api/users/signup',
                data: {
                    username,
                    email,
                    password,
                    passwordConfirm
                }
            });
            console.log(res.data);
            // registed as null at first because signup is async
            // setSignedUp(res.data);
            handleAuth(res.data.data)
            setIsLoading(false);
        } catch(error) {
            setSignupError(error);
            console.warn(error.response);
            setIsLoading(false);
        }
    }
    
    useEffect( () => {
        Router.prefetch('/chatAway')
        if (loggedInUser) Router.push('/chatAway');
    }, [loggedInUser])

    // passMask setStates
    // const [passMask, setPassMask] = useState(false);
    // const handlePassMask = () => setPassMask(!passMask);
    // const [confirmMask, setConfirmMask] = useState(false);
    // const handleConfirmMask = () => setConfirmMask(!confirmMask);


    if (loggedInUser) return <div className="loading"><CircularProgress /></div>
    if (!loggedInUser)  return (
        <>
            <Head>
                <title>Signup page</title>
            </Head>
           
            <div className="intro">
                <PersonAdd/>
                <h2>Create a new account!</h2>
                <Formik initialValues={{
                    username: '',
                    email: '',
                    password: '',
                    passwordConfirm: ''
                    }}
                    validationSchema={Yup.object({
                    username: Yup.string()
                        .min(2, 'Name must be 2+ characters!')
                        .max(20, "Name must have max 20 characters!")
                        .required('Required'),    
                    email: Yup.string()
                        .email("Invalid email!")
                        .required('Required'),
                    password: Yup.string()
                        .required('Required')
                        .min(8, 'Password must be 8+ characters!'),
                    passwordConfirm: Yup.string()
                        .required('Required')
                        .min(8, 'Password must be 8+ characters!')
                    })}
                        
                    onSubmit={(values) => {
                        const {username, email, password, passwordConfirm} = values;
                        signup(username, email, password, passwordConfirm)
                    }}
                >
                    <Form>
                        <FormikInput placeholder="Username"
                            name="username" type="text" 
                        />
                        <FormikInput placeholder="Email"
                            name="email" type="text"
                        />
                        <FormikInput placeholder="Password"
                            name="password" type="password"
                        />
                        <FormikInput placeholder="Confirm password"
                            name="passwordConfirm" type="password"
                        />
                        {signupError?<small>{signupError.response.data.message}!</small>:null}
                    
                        <Button variant="contained" color="primary" type="submit" className="customButton" disabled={isLoading}>
                            {!isLoading?"Submit":<CircularProgress style={{color:"white"}} size={25.5}/>}
                        </Button>
                        <Link href="/login">
                            <button className="signup noButtonStyle"> Already have an account? Login </button>
                        </Link>
                        
                    </Form>
                </Formik>
            </div>
        </>   
    );
}



export default SignupPage;