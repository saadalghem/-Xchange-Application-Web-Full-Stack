import Xchange from '../assets/Xchange-removebg-preview.png';
import {Link} from "react-router-dom";
import './Header.css';
function Header() {
    return (
        <nav className="navbar navbar-expand-lg bg-light">
            <ul className="nav">
                <li>
                    <img className="mx-auto h-16 w-auto" src={Xchange}/>
                </li>
                <li className="nav-item">
                    <h1 className="titre"><Link to="/" className="link-red"> XCHANGE</Link></h1>
                </li>
                <li className="nav-item">
                    <p className="phrase"><Link to="/Login" className="link-black">objet a donner</Link> </p>
                </li>
                <li className="nav-item">
                    <p className="phrase"><Link to="/Login" className="link-black">objet a echanger</Link></p>
                </li>
                <li className="nav-item">
                    <p className="phrase"><a href="/#footer_home" className="link-black">nous contacter</a></p>
                </li>
            </ul>
            <div className="buttons">
                <Link to="/registre"><input className="btn btn-success" type="button" value="sign up"/></Link>
                <Link to="/login"><input className="btn btn-success" type="button" value="sign in"/></Link>
            </div>
        </nav>
    );
}
export default Header;