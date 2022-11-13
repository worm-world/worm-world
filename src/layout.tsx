import React, {useState} from "react";
import { Outlet } from 'react-router-dom'
import Navbar from "./components/Navbar";

export default function Layout(): JSX.Element {
    const [navbarIsOpen, setNavbarIsOpen] = useState<Boolean>(false);
    const toggleNavbar = () => setNavbarIsOpen(!navbarIsOpen);
    return (
        <div id='layout'>
            <div id='navbar-view' style={{width: navbarIsOpen ? '20%' : '0%'}}>
                <Navbar />
            </div>
            <div id="page-view" style={{width: navbarIsOpen ? '80%' : '100%'}}>
                <button id='nav-button' onClick={toggleNavbar}>{'\u2630'}</button>
                <Outlet />
            </div>
        </div>
    );
}