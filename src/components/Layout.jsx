import React from "react";
import { Outlet } from "react-router-dom";

import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Footer from "../components/Footer.jsx";

function Layout() { // this page is to set a layout so we dont need to add the header and footer to each page
    return (
        <>
            <div id="website-content">
                <Sidebar/>

                <div id="main-content">
                    <Header/>
                    <Outlet/> { /* this is where the main content will go https://reactrouter.com/api/components/Outlet */ } 
                    <Footer/>
                </div>
            </div>
        </>
    );
};

export default Layout;