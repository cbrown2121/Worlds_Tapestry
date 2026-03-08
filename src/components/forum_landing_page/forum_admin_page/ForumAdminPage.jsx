import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import "./ForumAdminPage.css";

function ForumAdminPage( props ) {
    const state = useLocation().state;
    const [forumID, setForumID] = useState(state.forumID);
    const [forumName, setForumName] = useState(state.forumName);
    const [forumMap] = useState(state.forumMaps);
    const [forumCategories, setForumCategories] = useState([]);
    const [forumMembers, setForumMembers] = useState([]);

    const getForumMembers = () => {
        fetch(`http://localhost:5000/${forumID}/users`)
        .then(response => response.json())
        .then(memberList => {
            setForumMembers(memberList);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getForumMembers();
    }, []);

    let categoryNameSection = { type: "text", sectionTitle: "Category Name", sectionID:"CategoryName" };

    let categoryDescription = { type: "text", sectionTitle: "Category Description", sectionID:"CategoryDescription" };

    let categoryPinStatus = {
        type: "radio", sectionTitle: "Pinned Status", sectionID:"PinnedStatus",
        options: [
            {label:"Pinned", id:"PinnedStatus", value:"0", defaultChecked: false},
            {label:"Not Pinned", id:"PinnedStatus", value:"1", defaultChecked: true},
        ]
    };

    // latitude, longitude 42.42598922454695, -82.69651895016172

    let mapLatSection = { type: "text", sectionTitle: "Center Latitude", sectionID:"latitude" };

    let mapLongSection = { type: "text", sectionTitle: "Center Longitude", sectionID:"longitude" };

    return (
        <>
            <div className="admin-dash-page main-content">
                <FormElement  formTitle="Add A New Category" endPoint="category" method="POST" passToEndPoint={ [{key: "ForumID", value: forumID}] } submitButtonText="Create Category" sections={ [categoryNameSection, categoryDescription, categoryPinStatus] } />
                
                <div className="user-forms">
                    {forumMembers.map((member) => {
                        if (member.UserRole != "Owner") return <FormRow key={member.UserID} username={member.UserName} userID={member.UserID} userRole={member.UserRole} forumID={forumID}/>
                    })}
                </div>
                
                { (forumMap == 1) && 
                    <FormElement  formTitle="Change Map Center" endPoint="map/update-lat-long" method="PUT" passToEndPoint={ [{key: "ForumID", value: forumID}] } submitButtonText="Submit" sections={ [mapLatSection, mapLongSection] } />
                }
                
            </div>
        </>
    )
}

export default ForumAdminPage