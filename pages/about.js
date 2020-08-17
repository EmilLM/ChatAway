import React from "react";
import Layout from "../components/General/Layout";
import Head from "next/head";
import Grid from '@material-ui/core/Grid';

const About = (props) => (
    <>
        <Head>
            <title>About Chat App</title>
        </Head>
        <Grid container  className="about">
                    <h1>ChatAway</h1>
                    <div className="aboutDescription">
                        <h2>Description</h2>
                        <p>A work in progress but functional chat app similar to Slack, having both room and direct chat.</p>
                        <p>Developed as a way to supplement my front-end skills with new back-end abilities.</p>
                        <p>The information below only applies to the current state of the app. Being a proof of my abilities
                        /work in progress, the app will be gradually updated as I improve my skills and add new features.
                        </p>
                        <p><em>Disclaimer: Missing features and links that do not work as intended means that part was not implemented yet.</em></p>
                    </div>
                    <div className="aboutFeatures">
                        <h2>Features</h2>
                        <strong>Main features of the application are: </strong>
                        <p><strong>Authentication: </strong>User sign up, log in, , log out, forgot password/reset password by email. </p>   
                        <p><strong>Chat features: </strong>Room chat, direct friend chat, edit user profile: name, email, password, avatar, delete account.</p>
                        <p><strong>UX: </strong>Server-side rendered (SSR), fully responsive design, complete user privacy, great account/data security.</p>
                    </div>
                    <div className="aboutDoc">

                        <h2>Documentation</h2>

                        <a className="github" href="https://github.com/EmilLM/ChatAway">Github code</a>

                        <p className="stack"><strong>Main stack (MERN): </strong> <em>MongoDB, Express, React, Node</em></p>
                        <p className="stack"><strong>Secondary stack: </strong> <em>Next.js, Material-UI</em></p>
 
                        <h3>Dependencies:</h3>
                        
                        <p>
                            <strong>Security: </strong> 
                            bcryptjs, express-mongo-sanitize, express-rate-limit, helmet
                            hpp, json web token, xss-clean, validator, cors.
                        </p>
                        <p>
                            <strong>Data fetching: </strong>
                            axios, useSWR.
                        </p> 
                        <p>
                            <strong>Data modelling: </strong>
                            mongoose, mongoDB.
                        </p>
                        <p>
                            <strong> Forms/Image processing: </strong>
                            Formik, Yup, Multer, Sharp.
                        </p>
                        <p>
                            <strong>Email: </strong>
                            nodemailer, nodemailer-express-handlebars, html-to-text, SendGrid.
                        </p>

                        <h3>Routes:</h3>
                        <a href="https://documenter.getpostman.com/view/11920996/T17FAU73">Postman API routes link</a>

                        <h3>Environment variables</h3>

                        <ul>Required environmental variables in this project include:</ul>

                        <li><strong>DATABASE:</strong> MongoDB ChatAway connection string</li>
                        <li><strong>DATABASE_PASSWORD:</strong> MongoDB ChatAway database password</li>
                        <li><strong>JWT_SECRET:</strong> the secret string required for password encryption</li>
                        <li><strong>JWT_EXPIRES_IN:</strong> the time that the user token lasts</li>
                        <li><strong>JWT_COOKIE_EXPIRES_IN:</strong> the time that the user cookie lasts</li>
                        <li><strong>EMAIL_FROM:</strong> the ChatAway mail account</li>
                        <li><strong>SENDGRID_USERNAME:</strong> the SendGrid username for nodemailer</li>
                        <li><strong>SENDGRID_PASSWORD:</strong> the SendGrid password for nodemailer</li>


                    </div>
                    
        </Grid> 
    </>

);
export default About;