import { useState, useEffect } from "react";
import "./ThreadPage.css";
import ThreadContent from "./ThreadContent.jsx";
import Header from "../../../Header.jsx";
import Footer from "../../../Footer.jsx";
import { useLocation } from 'react-router-dom';

function ThreadPage() {
    const state = useLocation().state;

    return (
        <>
            <Header/>
            <ThreadContent threadID={ state.threadID }/>
            <Footer/>
        </>
    )
}

export default ThreadPage