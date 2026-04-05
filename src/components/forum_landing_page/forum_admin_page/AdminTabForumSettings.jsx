import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import "./ForumAdminPage.css";
import FormRadioSection from "../../form_component/FormRadioSection.jsx";

function AdminTabForumSettings(props) {
    const [forumID, setForumID] = useState(props.forumID);
    const [forumTags] = useState(props.forumTags.replace(",", ", "));

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
            <FormElement formTitle="Change Forum Settings" endPoint="update-forums" method="PUT" passToEndPoint={ [{key: "ForumID", value: forumID}] }>
                <FormRadioSection {...forumVisbilitySection}/>
                <FormRadioSection {...forumJoinSection}/>
                <FormRadioSection {...forumMapSection}/>
                <button type="submit" className="change-forum-settings">Update</button>
            </FormElement>

            <FormElement formTitle="Update Tags" endPoint="update-tags" method="PUT" passToEndPoint={ [{key: "ForumID", value: forumID}] }>
                <textarea name="ForumTags" id="ForumTags" defaultValue={forumTags}></textarea>
                <button type="submit" className="change-forum-settings">Update</button>
            </FormElement>
        </>
    )
}

export default AdminTabForumSettings