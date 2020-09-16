import "../styles/main.scss"
// required import to prevent prerendered icon before css loads
import '@fortawesome/fontawesome-svg-core/styles.css';
import React, {useEffect, useMemo, useState} from 'react';
import Layout from "../components/General/Layout";
import UserContext from "components/General/UserContext"
import Router from 'next/router';
import axios from 'axios';
import useSWR, {SWRConfig} from 'swr';


// import whyDidYouRender from '@welldone-software/why-did-you-render'
// Material UI integration imports
import PropTypes from 'prop-types';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../server/theme';


if (process.env.NODE_ENV !== 'production') {
  axios.defaults.baseURL = 'http://localhost:3000'
} else {
  axios.defaults.baseURL = 'https://chat-away-app.herokuapp.com'
}
// why-did-you-render setting
// if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
//   whyDidYouRender(React)
// }


export default function MyApp({ Component, pageProps}) {
  
  
  const [loginStatus, setLoginStatus] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState();
  const [loading ,setLoading] = useState(true)

  // const {data: swrUser, error } = useSWR('/loggedIn', (...args) => axios(...args).then(res => res.data.user ))
  // console.log('SWR user', swrUser)

 
  const checkLoginStatus = async () => {
    setLoading(true)
    try {
      const res= await axios.get('/loggedIn')
      console.log('Log in status', res.data)
      // for various situations of loggedIn status
      if (res.data && !loginStatus) {
        setLoginStatus(true);
        setLoggedInUser(res.data.user);
        setLoading(false)
      } else if (!res.data.status && loginStatus) {
        setLoginStatus(false);
        setLoggedInUser(null);
      }     
    } catch(err) {
      console.log(err.response);
    }  
  }
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
      Router.replace('/index');
    }
  }, [])
  
  if (loading) return null
  return (
    <UserContext.Provider value={{loggedInUser, handleLogout, handleAuth}}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SWRConfig value={{ fetcher: (...args) => axios(...args).then(res => res.data )}}>
          <Layout >
            <Component {...pageProps} loggedInUser={loggedInUser}  loginStatus={loginStatus} handleLogout={handleLogout}/>
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


