import Link from "next/link";
import Button from '@material-ui/core/Button';


const NavBar = React.memo(({loggedInUser}) => {
    
    
    return (
        <nav className="navbar">
            <a className="logo" href={loggedInUser?"/chatAway":"/index"} rel="noopener noreferrer">
                <img src="/logo.png" alt="logo"/>
            </a>
            <div className="navLinks">
                <Link  href={loggedInUser?"/chatAway":"/index"}>
                    <Button  className="nav-link">{loggedInUser?"ChatAway":"Home"} </Button>
                </Link>
                <Link  href="/about">
                    <Button className="nav-link">About</Button>
                </Link>
                {loggedInUser && <Link  href="/user-profile/main">
                    <Button className="nav-link">Profile</Button>
                </Link> }
            </div>
        </nav>
    )
});

export default NavBar;