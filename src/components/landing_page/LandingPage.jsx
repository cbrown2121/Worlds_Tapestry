import { useState, useEffect, useContext } from "react";
import bookIcon from "../../assets/book-icon.svg";
import "./LandingPage.css";
import CommunityTab from "./CommunityTab";
import TrendingTab from "./TrendingTab";
import FormElement from "../form_component/FormElement.jsx";
import FormTextSection from "../form_component/FormTextSection.jsx";
import FormRadioSection from "../form_component/FormRadioSection.jsx";
import { UserContext } from "../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../utility.js";

// for now the "my communities" section is all the forums in our database

function LandingPage() {
    const [forumList, setForumList] = useState([]);
    const { user, loggedIn } = useContext(UserContext);

    let landingPageText = (loggedIn()) ? "My Communities" : "Communities";

    useEffect(() => {
        let fetchUrl = `public-forums`;

        if (loggedIn()) {
            fetchUrl = `user-forums/${user.UserID}`
        }

        universalDatabaseFetch(fetchUrl).then(forumList => {
            setForumList(forumList);
        });
    }, []);

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
                    { loggedIn() ?
                        // <FormElement  formTitle="Create A Community" endPoint="forums" method="POST" passToEndPoint={ [{key: "UserID", value: user.UserID}] } submitButtonText="Create Community" sections={ [forumNameSection, forumVisbilitySection, forumJoinSection, forumMapSection, forumTagsSection] } /> 
                        <div className="">
                            <FormElement passToEndPoint={[{key: "UserID", value: user.UserID}]} method="POST" endPoint="forums" formTitle="Create A Community">
                                <FormTextSection type="text" sectionTitle="Community Name" sectionID="ForumName"/>
                                <FormRadioSection {...forumVisbilitySection} />
                                <FormRadioSection {...forumJoinSection} />
                                <FormRadioSection {...forumMapSection} />
                                <FormTextSection type="text" sectionTitle="Community Tags" sectionID="Tags"/>
                                <button className="createForum" type="submit">Create Forum</button>
                            </FormElement>
                        </div>

                        : null
                    }
                </div>
                <div id="landing-right">
                    <div id="my-communities-header">
                        <img id="my-communities-header-icon" src={bookIcon} alt="" />
                        <h1 id="my-communities-header-text" >{landingPageText}</h1>
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