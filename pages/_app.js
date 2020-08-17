import "../styles/main.scss"
// required import to prevent prerendered icon before css loads
import '@fortawesome/fontawesome-svg-core/styles.css';
import React, {useEffect, useMemo, useState} from 'react';
import Layout from "../components/General/Layout";
import UserContext from "components/General/UserContext"
import Router from 'next/router';
import axios from 'axios';
import useSWR, {SWRConfig} from 'swr';


// Material UI integration imports
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../server/theme';

// const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
// const apiUrl = process.browser
//   ? `${protocol}://${window.location.host}`
//   : `${protocol}://${req.headers.host}`

if (process.env.NODE_ENV !== 'production') axios.defaults.baseURL = 'http://localhost:3000'

axios.defaults.baseURL = 'https://chat-away-app.herokuapp.com';

export default function MyApp({ Component, pageProps }) {
  

  const [loginStatus, setLoginStatus] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
 
  const checkLoginStatus = async () => {
    try {
      const res= await axios.get('/loggedIn')
   
      // for various situations of loggedIn status
      if (res.data && !loginStatus) {
        setLoginStatus(res.data.status);
        setLoggedInUser(res.data.user);
      } else if (!res.data.status && loginStatus) {
        setLoginStatus(false);
        setLoggedInUser(null);
      }     
    } catch(err) {
      console.log(err.response);
    }  
  }
  // const {data: loggedInUser, error } = useSWR('/api/users/me')

  // useSWR in _app.js needs to have its fetcher because this line is read first, b4 the SWRConfig with the fetcher
  //  const {data: onlineUser, error} = useSWR('/loggedIn', (...args) => axios(...args).then(res => res.data )) 
  // console.log('Logged in as:', onlineUser)


  
  // method to lift up state from login
  const handleAuth = (data) => {
    setLoginStatus(true);
    setLoggedInUser(data.user)
  }

  const handleLogout = async () => {
    try {
        const res = await axios.get('/api/users/logout');
        setLoginStatus(res.data.status);
        setLoggedInUser(null)
    } catch(err) {
        console.log(err.response);
    }
  }
  
  // Material UI integration
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect( () => {
    checkLoginStatus();
    if (loginStatus === "logged-out") {
      Router.push('/index');
    }
  }, [loggedInUser])
  
  const memoizedValue = useMemo( () => ({
    loggedInUser,
    handleLogout,
    handleAuth
  }), [loggedInUser, handleLogout, handleAuth])
  
   return (
    <UserContext.Provider value={memoizedValue}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SWRConfig value={{ fetcher: (...args) => axios(...args).then(res => res.data )}}>
          <Layout >
            <Component {...pageProps} loggedInUser={loggedInUser}  loginStatus={loginStatus}/>
          </Layout>
        </SWRConfig>
      </ThemeProvider>
    </UserContext.Provider>
  )
}
MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

