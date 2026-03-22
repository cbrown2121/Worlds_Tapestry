import { useState, useEffect, useContext } from "react";
import bookIcon from "../../assets/book-icon.svg";
import "./LandingPage.css";
import CommunityTab from "./CommunityTab";
import TrendingTab from "./TrendingTab";
import FormElement from "../form_component/FormElement.jsx";
import { UserContext } from "../../contexts/Context.jsx";

// for now the "my communities" section is all the forums in our database

function LandingPage() {
    const [forumList, setForumList] = useState([]);
    const sampleForumId = 1;
    const { user } = useContext(UserContext);

    const requestForAllForums = `http://localhost:5000/forums`; // only for testing purposes
    const requestForUserForums = `http://localhost:5000/usersforums/${sampleForumId}`; // the route that will be used in the final deployment

    useEffect(() => {
        fetch(requestForAllForums)
        .then(response => response.json())
        .then(forumList => {
            setForumList(forumList.reverse());
        }).catch(error => console.error(error));
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

    return (
        <>
            <div id="landing-page" className="main-content">
                <div id="landing-left">
                    <FormElement  formTitle="Create A Community" endPoint="forums" method="POST" passToEndPoint={ [{key: "UserID", value: user.UserID}] } submitButtonText="Create Community" sections={ [forumNameSection, forumVisbilitySection, forumJoinSection, forumMapSection] } />
                </div>
                <div id="landing-right">
                    <div id="my-communities-header">
                        <img id="my-communities-header-icon" src={bookIcon} alt="" />
                        <h1 id="my-communities-header-text" >Your Communities</h1>
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