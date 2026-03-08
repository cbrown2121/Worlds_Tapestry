import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import "./ForumAdminPage.css";

function AdminTabCategorySettings( props ) {
    const [forumID, setForumID] = useState(props.forumID);

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
            <FormElement formID="add-forum-categories" formTitle="Add A New Category" endPoint="category" method="POST" passToEndPoint={ [{key: "ForumID", value: forumID}] } submitButtonText="Create Category" sections={ [categoryNameSection, categoryDescription, categoryPinStatus] } />
        </>
    )
}

export default AdminTabCategorySettings;