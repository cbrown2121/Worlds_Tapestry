import { useState, useEffect } from "react";
import bookIcon from "../../assets/book-icon.svg";
import "./LandingPage.css";
import CommunityTab from "./CommunityTab";
import TrendingTab from "./TrendingTab";
import FormElement from "../form_component/FormElement.jsx";
import DashBoardPost from "./DashboardPost.jsx";

// for now the "my communities" section is all the forums in our database

function LandingPage() {
    const [postList, setPostList] = useState([]);
    const sampleUserId = 1;

    useEffect(() => {
        fetch(`http://localhost:5000/user-dash-threads/${sampleUserId}`) // get original thread posts from all forums the user is in
        .then(response => response.json())
        .then(dashboardPosts => {
            setPostList(dashboardPosts);
        }).catch(error => console.error(error));
    }, []);

    return (
        <>
            <div id="landing-page" className="main-content">
                <div id="landing-left">
                    <h2>Threads From Followed Forums</h2>
                    {postList.map((post) => (
                        <DashBoardPost key={ `${post.ThreadID}-${post.CategoryID}-${post.CreatorID}` } {...post} />
                    ))}
                    {/* <FormElement  formTitle="Create A Forum" endPoint="forums" passToEndPoint={ [{key: "UserID", value: sampleUserId}] } submitButtonText="Create Forum" sections={ [forumNameSection, forumVisbilitySection, forumJoinSection, forumMapSection] } /> */}
                </div>
                <div id="landing-right">
                    <div id="dashboard-profile-overview">
                        <div id="dashboard-overview-profile"></div>
                        <div id="dashboard-name-profile">Username</div>
                    </div>
                    <div id="dashboard-quick-message">
                        Put quick access to user messages here
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage