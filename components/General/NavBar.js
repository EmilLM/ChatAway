import Link from "next/link";
import { useContext } from "react";
import UserContext from "./UserContext";
import Button from '@material-ui/core/Button';


const NavBar = () => {
    
    const {loggedInUser} = useContext(UserContext);
    
    return (
        <nav className="navbar">
            <a className="logo" href={loggedInUser?"/chatAway":"/index"}>
                <img src="/logo.png" alt="logo"/>
            </a>
            <div className="navLinks">
                <Link  href={!!loggedInUser?"/chatAway":"/index"}>
                    <Button  className="nav-link">{loggedInUser?"ChatAway":"Home"} </Button>
                </Link>
                <Link  href="/about">
                    <Button className="nav-link">About</Button>
                </Link>
                {!!loggedInUser && <Link  href="/user-profile/main">
                    <Button className="nav-link">Profile</Button>
                </Link> }
            </div>
        </nav>
    )
};

export default NavBar;