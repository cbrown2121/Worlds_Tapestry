import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";

function Layout() { // this page is to set a layout so we dont need to add the header and footer to each page
    return (
        <>
            <div id="website-content">
                <Header/>
                <div id="main-page">
                    <Sidebar id="sidebar-left"/>
                    <div id="main-content">
                        <Outlet/> { /* this is where the main page content will go https://reactrouter.com/api/components/Outlet */ } 
                    </div>
                    <div id="second-sidebar"></div>
                </div>
                <Footer/>
            </div>
        </>
    );
};

export default Layout;