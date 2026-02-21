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
            <div className="category-landing-page landing-page">
                <div className="category-landing-main landing-page-main">
                    <ForumSection title="Threads" categoryTabsList=
                        {threads.map((thread) => (
                            <ThreadTab key={thread.ThreadsID} {...thread} />
                        ))}
                    />
                </div>
                <div className="category-landing-side landing-page-side">
                    <div className="category-information-stats landing-page-information-stats">
                        <img src={defaultIcon} alt="" className="forum-image" />
                        <div className="category-stats landing-page-stats">
                            <h2 className="category-name">Category Name</h2>
                            <p>This text states the rules and purpose of the category</p>
                        </div>
                    </div>
                    <button onClick={ createThread } className="create-thread">Create a Thread</button>
                </div>
            </div>
        </>
    )
}

export default CategoryLandingPage