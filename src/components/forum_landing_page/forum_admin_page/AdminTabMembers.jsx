import { useState, useEffect, memo } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import MemberListForm from "../../form_component/MemberListForm.jsx";
import "./ForumAdminPage.css";

function AdminTabMembers( props ) {
    const [forumID, setForumID] = useState(props.forumID);
    const [userRole] = useState(props.userRole);
    const [sampleUserID] = useState(1);

    let categoryNameSection = { type: "text", sectionTitle: "Category Name", sectionID:"CategoryName" };

    let categoryDescription = { type: "text", sectionTitle: "Category Description", sectionID:"CategoryDescription" };

    let categoryPinStatus = {
        type: "radio", sectionTitle: "Pinned Status", sectionID:"PinnedStatus",
        options: [
            {label:"Pinned", id:"PinnedStatus", value:"0", defaultChecked: false},
            {label:"Not Pinned", id:"PinnedStatus", value:"1", defaultChecked: true},
        ]
    };

    return (
        <>
            <div className="admin-tab admin-members-page">
                <MemberListForm userID={sampleUserID} forumID={forumID} userRole={userRole}/>
            </div>
        </>
    )
}

export default AdminTabMembers