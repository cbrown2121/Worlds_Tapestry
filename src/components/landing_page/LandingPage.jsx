import { useState, useEffect, useContext } from "react";
import bookIcon from "../../assets/book-icon.svg";
import "./LandingPage.css";
import CommunityTab from "./CommunityTab";
import TrendingTab from "./TrendingTab";
import FormElement from "../form_component/FormElement.jsx";
import { UserContext } from "../../contexts/Context.jsx";
import { universalDatabaseFetch } from "../../utility.js";
import { LoginForm } from "../form_component/LoginForm.jsx";

// for now the "my communities" section is all the forums in our database

function LandingPage() {
    const [forumList, setForumList] = useState([]);

    const { user, loggedIn } = useContext(UserContext);

    useEffect(() => {
        let fetchUrl = `public-forums`;

        if (loggedIn()) {
            fetchUrl = `usersforums/${user.UserID}`
        }

        universalDatabaseFetch(fetchUrl).then(forumList => {
            setForumList(forumList);
        });
    }, []);

    let forumNameSection = { type: "text", sectionTitle: "Community Name", sectionID:"ForumName" };

    let forumVisbilitySection = {
        type: "radio", sectionTitle: "Community Visibility", sectionID:"ForumVisibility",
        options: [
            {label:"Searchable", id:"SearchVisibility", value:"Searchable", defaultChecked: true},
            {label:"Hidden", id:"SearchVisibility", value:"Hidden", defaultChecked: false},
        ]
    };

    let forumJoinSection = {
        type: "radio", sectionTitle: "Community Join Settings", sectionID:"ForumJoinPermissions",
        options: [
            {label:"Anyone", id:"JoinPermissions", value:"Anyone", defaultChecked: true},
            {label:"Invite Only", id:"JoinPermissions", value:"Invite Only", defaultChecked: false},
        ]
    };

    let forumMapSection = {
        type: "radio", sectionTitle: "Allow Maps", sectionID:"MapPermissions",
        options: [
            {label:"Yes", id:"AllowMaps", value:"1", defaultChecked: false},
            {label:"No", id:"AllowMaps", value:"0", defaultChecked: true},
        ]
    };

    let sidebarElement = (loggedIn()) ? <FormElement  formTitle="Create A Community" endPoint="forums" method="POST" passToEndPoint={ [{key: "UserID", value: user.UserID}] } submitButtonText="Create Community" sections={ [forumNameSection, forumVisbilitySection, forumJoinSection, forumMapSection] } /> : null;

    return (
        <>
            <div id="landing-page" className="main-content">
                <div id="landing-left">
                    { sidebarElement }
                </div>
                <div id="landing-right">
                    <div id="my-communities-header">
                        <img id="my-communities-header-icon" src={bookIcon} alt="" />
                        <h1 id="my-communities-header-text" >Communities</h1>
                    </div>
                    
                    <div id="my-communities">
                        {forumList.map((forum) => (
                            <CommunityTab key={ forum.ForumID } {...forum} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LandingPage