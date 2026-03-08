import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./ForumLandingPage.css";
import CategoryTab from "./CategoryTab";
import ForumSection from "./ForumSection";
import ForumTrendingTab from "./ForumTrendingTab";
import defaultIcon from "../../assets/commmunity-default-icon.svg";
import FormElement from "../form_component/FormElement.jsx";

function ForumLandingPage( props ) {
    const [forumID] = useState(props.forumID)
    const [forumName] = useState(props.forumName)
    const [categories, setCategories] = useState([]);

    const [userRole, setUserRole] = useState(null);
    const [joinButtonText, setJoinButtonText] = useState("Join Forum");

    const sampleUserID = 1;
    
    const getForumCategories = () => {
        fetch(`http://localhost:5000/categories/${forumID}`)
        .then(response => response.json())
        .then(categoryList => {
            createCategories(categoryList);
        }).catch(error => console.error(error));
    }

    const getUserRoleInForum = () => {
        fetch(`http://localhost:5000/forum-membership/${forumID}/${sampleUserID}`)
        .then(response => response.json())
        .then(userRole => {

            if (userRole.length == 1) { // the response will return nothing if the user is not in the forum. it should never be higher than 1 since a user cannot be in a forum twice.
                setUserRole(userRole[0].UserRole); // the array only has one element so this is safe
                setJoinButtonText("Leave Forum");
            }

        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getForumCategories();
        getUserRoleInForum();
    }, []);

    const createCategories = (categoriesList) => {
        for (let i = 0; i < categoriesList.length; i++) {
            let category = categoriesList[i];
            if (category.Pinned == 1) { // category is pinned
                setCategories(categories => [{...category}, ...categories] ); // put the category at the front of the list
            } else { // category is not pinned
                setCategories(categories => [...categories, {...category}] );
            }
        }
    }

    const joinButtonAction = () => {

        if (userRole == null) { // user is joining the forum
            fetch(`http://localhost:5000/add-user-to-forum`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: sampleUserID, ForumID: forumID, UserRole: "Member"})
            }).then(response => response.json()).catch(error => console.error(error));

            setUserRole("member");
            setJoinButtonText("Leave Forum");
            

        } else { // user is leaving the forum. 
            fetch(`http://localhost:5000/remove-user-from-forum`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: sampleUserID, ForumID: forumID})
            }).then(response => response.json()).catch(error => console.error(error));

            setUserRole(null);
            setJoinButtonText("Join Forum");
        } 
        // in the future there should be more depending on the role since leaving should be more involved if theyre the forum owner
    }
    
    
    return (
        <>
            <div className="forum-landing-page main-content">
                <div className="forum-landing-main">
                    <ForumSection title="Categories" categoryTabsList=
                        {categories.map((category) => (
                            <CategoryTab key={category.CategoryID} {...category}/>
                        ))}
                    />
                </div>
                <div className="forum-landing-side">
                    <div className="forum-information">
                        <img src={defaultIcon} alt="" className="forum-image" />
                        <h2 className="forum-name">{ forumName }</h2>
                    </div>

                    <button id="forum-join-button" onClick={ joinButtonAction }> {joinButtonText} </button>

                    <Link
                        className="router-link"
                        to="/map"
                        state={{
                            forumID: forumID,
                            forumName: forumName
                        }}
                        >
                        <button id="forum-map-button">View Forum on Map</button>
                    </Link>

                    <div className="side-bar-section">
                        <div className="side-bar-section-title">
                            <h1>Top Tags</h1>
                        </div>
                        <div className="side-bar-section-container"></div>
                    </div>

                    { (userRole == "Admin" || userRole == "Owner") && 
                        <div className="side-bar-section">
                            <div className="side-bar-section-title">
                                <h1>Admin Dash</h1>
                            </div>
                            <Link key={ `${forumID}-${forumName}-admin` } className="router-link" 
                            to={ `/Forum/${ forumName.replace(/[ ]/g, "_") }/Admin-Dashboard` } 
                            state={{ 
                                forumID: forumID,
                                forumName: forumName
                            }}
                            >
                                <button id="forum-settings" > Forum Settings </button>
                            </Link>
                        </div>
                    } 
                </div>
            </div>
        </>
    )
}

export default ForumLandingPage