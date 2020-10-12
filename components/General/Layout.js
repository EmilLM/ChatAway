import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

import Container from '@material-ui/core/Container';


const Layout = React.memo(({children, loggedInUser}) => {
    // layout rerenders on page change -> page is a prop child
    return (
        <>
            <NavBar loggedInUser={loggedInUser}/>
            <Container maxWidth="md"  className="container">
                {children}
            </Container>
            <Footer/>
        </>
    )
});

export default Layout;