import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";

import Container from '@material-ui/core/Container';


export default function Layout(props) {
    return (
        <>
            <NavBar/>
                <Container maxWidth="md"  className="container">
                    {props.children}
                </Container>
            <Footer/>
        </>
    )
}