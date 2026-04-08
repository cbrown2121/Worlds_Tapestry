import { useState, useEffect, useContext } from "react"
import { useLocation } from 'react-router-dom';
import "../ForumLandingPage.css"
import CategoryTab from "../CategoryTab"
import ForumSection from "../ForumSection"
import ForumTrendingTab from "../ForumTrendingTab"
import defaultIcon from "../../../assets/commmunity-default-icon.svg"
import ThreadTab from "./ThreadTab.jsx"
import FormElement from "../../form_component/FormElement.jsx";
import FormTextSection from "../../form_component/FormTextSection.jsx";
import { UserContext } from "../../../contexts/Context.jsx";
import { universalDatabaseFetch } from "../../../utility.js";

const CategoryLandingPage = ( props ) => {
    const state = useLocation().state;

    const [forumID] = useState(state.forumID);
    const [forumName] = useState(state.forumName);
    const [categoryName] = useState(state.categoryName);
    const [categoryID] = useState(state.categoryID);
    const [threads, setThreads] = useState([]);

    const { user, loggedIn } = useContext(UserContext);

    useEffect(() => { 
        universalDatabaseFetch(`threads/${categoryID}`)
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
                        <h2 className="forum-name">{state.categoryName}</h2>
                    </div>

                    <FormElement formTitle="Create A Thread" endPoint="create-thread" method="POST" passToEndPoint={ [{key: "UserID", value: user.UserID}, {key: "CategoryID", value: categoryID}] }>
                        <FormTextSection type="text" sectionTitle="Title" sectionID="ThreadName"/>
                        <FormTextSection type="text" sectionTitle="Content" sectionID="Content"/>
                        <button className="create-thread-button" type="submit">Create Thread</button>
                    </FormElement>
                </div>
            </div>
        </>
    )
}

export default CategoryLandingPage;