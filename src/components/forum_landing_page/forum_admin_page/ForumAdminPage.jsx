import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";

function ForumAdminPage( props ) {
    const state = useLocation().state;
    const [forumID, setForumID] = useState(state.forumID);
    const [forumName, setForumName] = useState(state.forumName);
    
    // const getForumCategories = () => {
    //     fetch(`http://localhost:5000/categories/${forumID}`)
    //     .then(response => response.json())
    //     .then(categoryList => {
    //         createCategories(categoryList);
    //     }).catch(error => console.error(error));
    // }

    // useEffect(() => {
    //     getForumCategories();
    //     getUserRoleInForum();
    // }, []);


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
            <div className="forum-landing-page main-content">
                <FormElement  formTitle="Add A New Category" endPoint="category" passToEndPoint={ [{key: "ForumID", value: forumID}] } submitButtonText="Create Category" sections={ [categoryNameSection, categoryDescription, categoryPinStatus] } />
            </div>
        </>
    )
}

export default ForumAdminPage