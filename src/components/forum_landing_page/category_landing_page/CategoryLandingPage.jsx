import { useState, useEffect } from "react"
import "../ForumLandingPage.css"
import CategoryTab from "../CategoryTab"
import ForumSection from "../ForumSection"
import ForumTrendingTab from "../ForumTrendingTab"
import defaultIcon from "../../../assets/commmunity-default-icon.svg"
import ThreadTab from "./ThreadTab.jsx"

function CategoryLandingPage( props ) {
        const [forumID, setForumID] = useState(props.forumID);
        const [categoryID, setCategoryID] = useState(props.categoryID);
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
            <div className="forum-landing-page">
                <div className="forum-landing-main">
                    <ForumSection title="Threads" categoryTabsList=
                        {threads.map((thread) => (
                            <ThreadTab key={thread.ThreadID} {...thread} />
                        ))}
                    />
                </div>
                <div className="forum-landing-side">
                    <div className="forum-information">
                        <img src={defaultIcon} alt="" className="forum-image" />
                        <h2 className="forum-name">{props.categoryName}</h2>
                    </div>

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

export default CategoryLandingPage