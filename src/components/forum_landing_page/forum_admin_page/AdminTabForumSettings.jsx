import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import "./ForumAdminPage.css";

function AdminTabForumSettings(props) {
    const [forumID, setForumID] = useState(props.forumID);

    // later change fields so defaults reflect current settings

    let forumVisbilitySection = {
        type: "radio", sectionTitle: "Update Visibility", sectionID:"ForumVisibility",
        options: [
            {label:"Searchable", id:"SearchVisibility", value:"Searchable", defaultChecked: true},
            {label:"Hidden", id:"SearchVisibility", value:"Hidden", defaultChecked: false},
        ]
    };

    let forumJoinSection = {
        type: "radio", sectionTitle: "Update Join Settings", sectionID:"ForumJoinPermissions",
        options: [
            {label:"Anyone", id:"JoinPermissions", value:"Anyone", defaultChecked: true},
            {label:"Invite Only", id:"JoinPermissions", value:"Invite Only", defaultChecked: false},
        ]
    };

    let forumMapSection = {
        type: "radio", sectionTitle: "Update Map Settings", sectionID:"MapPermissions",
        options: [
            {label:"Allow Maps", id:"AllowMaps", value:"1", defaultChecked: false},
            {label:"Don't Allow Maps", id:"AllowMaps", value:"0", defaultChecked: true},
        ]
    };

    return (
        <>
            <FormElement  formTitle="Change Forum Settings" endPoint="update-forums" method="PUT" passToEndPoint={ [{key: "ForumID", value: props.forumID}] } submitButtonText="Update" sections={ [forumVisbilitySection, forumJoinSection, forumMapSection] }/>
        </>
    )
}

export default AdminTabForumSettings