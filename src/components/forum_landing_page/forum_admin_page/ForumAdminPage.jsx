import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import AdminTabMembers from "./AdminTabMembers.jsx";
import "./ForumAdminPage.css";
import AdminTabCategorySettings from "./AdminTabCategorySettings.jsx";
import AdminTabMapSettings from "./AdminTabMapSettings.jsx";
import AdminTabForumSettings from "./AdminTabForumSettings.jsx";

function ForumAdminPage( props ) {
    const state = useLocation().state;
    const [forumID, setForumID] = useState(state.forumID);
    const [forumName, setForumName] = useState(state.forumName);
    const [forumMap] = useState(state.forumMaps == 1);
    const [userRole] = useState(state.userRole);
    const [currentPageState, setCurrentPageState] = useState("member");

    const handleTabSwitch = (event) => {
        document.getElementById(`admin-dash-${currentPageState}-settings-button`).classList.remove("active");

        if (event.target.value == "member" || event.target.value == "forum" || event.target.value == "category" || event.target.value == "map") {
            setCurrentPageState(event.target.value);

            event.target.classList.add("active");
        }
    }

    return (
        <>
            <div className="admin-dash-page main-content">
                <div className="admin-dash-sidebar">
                    <button id="admin-dash-member-settings-button" className="admin-dash-nav-buttons active" value="member" onClick={ handleTabSwitch }>Member Settings</button>
                    <button id="admin-dash-category-settings-button" className="admin-dash-nav-buttons" value="category" onClick={ handleTabSwitch } >Categories</button>
                    <button id="admin-dash-forum-settings-button" className="admin-dash-nav-buttons" value="forum" onClick={ handleTabSwitch }>Community Settings</button>
                    {/* { forumMap && 
                        <button id="admin-dash-map-settings-button" className="admin-dash-nav-buttons" value="map" onClick={ handleTabSwitch }>Map Settings</button>
                    } */}
                </div>

                { currentPageState == "member" &&
                    <AdminTabMembers forumID={ forumID } userRole={userRole} />
                }

                { currentPageState == "forum" &&
                    <AdminTabForumSettings forumID={ forumID } forumTags={state.forumTags} />
                }

                { currentPageState == "category" &&
                    <AdminTabCategorySettings forumID={ forumID }/>
                }

                {/* { currentPageState == "map" && 
                    <AdminTabMapSettings forumID={ forumID } />
                } */}
                
            </div>
        </>
    )
}

export default ForumAdminPage