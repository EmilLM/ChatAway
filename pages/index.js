import Head from 'next/head';
import React, { useEffect } from "react";
import Router from 'next/router';
import Link from 'next/link';
import {Button} from '@material-ui/core';


const Index = ({loggedInUser}) => {

  useEffect( ()=> {
    if (loggedInUser) Router.replace('/chatAway')
  },[loggedInUser])
    return (
      <>
        <Head>
            <title>ChatAway</title>
        </Head>
        <div className="intro">
          <img src="/ChatAway.png" alt="ChatAway! Logo"/>
          <div className="appInfo">
            <div className="biggerText">A simple <a href="#">Slack-type</a> chat application</div>
            <div className="smallerText">developed using</div>
            <div className="biggerText">MERN stack and Next.js</div>
            <div className="smallerText">developed by</div>
            <a href="https://www.linkedin.com/in/emil-luchian-990/" alt="linkedin"><img src="/LEM.png" alt="LEM Logo"/></a>
          </div>
          <div className="options">
            <Link href="/login">
              <Button variant="contained" color="primary" className="customButton" >Login</Button>
            </Link>
            <Link href="/signup">
              <Button variant="contained" color="primary" className="customButton" >Sign up</Button>
            </Link>
          </div>
        </div> 
    </>
  )
};


export default Index
