import { useState, useEffect } from "react"
import { useLocation } from 'react-router-dom';
import "../ForumLandingPage.css"
import CategoryTab from "../CategoryTab"
import ForumSection from "../ForumSection"
import ForumTrendingTab from "../ForumTrendingTab"
import defaultIcon from "../../../assets/commmunity-default-icon.svg"
import ThreadTab from "./ThreadTab.jsx"

const CategoryLandingPage = ( props ) => {
    const state = useLocation().state;

    const [forumID] = useState(state.forumID);
    const [forumName] = useState(state.forumName);
    const [categoryName] = useState(state.categoryName);
    const [categoryID] = useState(state.categoryID);
    const [threads, setThreads] = useState([]);

    useEffect(() => { 
        fetch(`http://localhost:5000/threads/${categoryID}`)
        .then(response => response.json())
        .then(threadList => {
            setThreads(threadList);
        }).catch(error => console.error(error));  
    }, []);

    const createThread = () => {
        
    }

    return (
        <>
            <div className="forum-landing-page main-content">
                <div className="forum-landing-main">
                    <ForumSection title="Threads" categoryTabsList=
                        {threads.map((thread) => (
                            <ThreadTab key={thread.ThreadID} CategoryName={categoryName} ForumName={forumName} {...thread} />
                        ))}
                    />
                </div>
                <div className="forum-landing-side">
                    <div className="forum-information">
                        <img src={defaultIcon} alt="" className="forum-image" />
                        <h2 className="forum-name">{state.categoryName}</h2>
                    </div>

                    <button className="create-thread-button">Create A Thread</button>

                    {/* <button id="forum-join-button" > Hi </button>

                    <div className="side-bar-section">
                        <div className="side-bar-section-title">
                            <h1>Top Tags</h1>
                        </div>
                        <div className="side-bar-section-container"></div>
                    </div> */}
                </div>
            </div>
        </>
    )
}

export default CategoryLandingPage;