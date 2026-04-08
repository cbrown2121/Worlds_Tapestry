import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import "./ForumLandingPage.css";
import CategoryTab from "./CategoryTab";
import ForumSection from "./ForumSection";
import ForumTrendingTab from "./ForumTrendingTab";
import defaultIcon from "../../assets/commmunity-default-icon.svg";
import { UserContext } from "../../contexts/Context";
import { universalDatabaseFetch } from "../../utility";

function ForumLandingPage( props ) {
    const [forumID, setForumID] = useState(null);
    const [forumName, setForumName] = useState(null);
    const [tagList, setTagList] = useState([]);
    const [categories, setCategories] = useState([]);

    const [userRole, setUserRole] = useState(null);
    const [joinButtonText, setJoinButtonText] = useState("Join Community");

    const { user, loggedIn } = useContext(UserContext);
    
    const getForumCategories = (forumID) => {
        universalDatabaseFetch(`categories/${forumID}`).then((data) => {
            console.log(data)
            createCategories(data);
        });
    }

    const getUserRoleInForum = () => {
        universalDatabaseFetch(`forum-membership/${forumID}/${user.UserID}`).then((data) => {
            if (data.length == 1) { // the response will return nothing if the user is not in the forum. it should never be higher than 1 since a user cannot be in a forum twice.
                setUserRole(data[0].UserRole); // the array only has one element so this is safe
                setJoinButtonText("Leave Community");
            }
        });
    }

    useEffect(() => {
        let path = window.location.pathname;
        let textToSkip = "/Forum/";
        let forumNameStart = path.indexOf("/Forum/") + textToSkip.length;

        universalDatabaseFetch(`forum/${path.substring(forumNameStart)}`).then((data) => {
            if (data.successful) {
                let forumData = data.results[0];
                setForumID(forumData.ForumID);
                setForumName(forumData.ForumName);

                if (forumData.Tags != null || forumData.Tags != undefined) {
                    setTagList(forumData.Tags.split(","));
                    console.log(forumData.Tags.split(","));
                }
                getForumCategories(forumData.ForumID);
            }
        });

        if (loggedIn()) {
            getUserRoleInForum();
        }

    }, []);

    const createCategories = (categoriesList) => {
        setCategories([]);
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
                body: JSON.stringify({UserID: user, ForumID: forumID, UserRole: "Member"})
            }).then(response => response.json()).catch(error => console.error(error));

            setUserRole("member");
            setJoinButtonText("Leave Community");
            

        } else { // user is leaving the forum. 
            fetch(`http://localhost:5000/remove-user-from-forum`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: user, ForumID: forumID})
            }).then(response => response.json()).catch(error => console.error(error));

            setUserRole(null);
            setJoinButtonText("Join Community");
        } 
        // in the future there should be more depending on the role since leaving should be more involved if theyre the forum owner
    }
    
    return (
        <>
            <div className="forum-landing-page main-content">
                <div className="forum-landing-main">
                    <ForumSection title="Categories" categoryTabsList=
                        {categories.map((category, index) => (
                            <CategoryTab key={`${category.CategoryID}-index`} ForumName={forumName} {...category}/>
                        ))}
                    />
                </div>
                <div className="forum-landing-side">
                    <div className="forum-information">
                        <h2 className="forum-name">{ forumName }</h2>

                        { loggedIn() &&
                            <button id="forum-join-button" onClick={ joinButtonAction }> {joinButtonText} </button>
                        }
                    </div>


                    { (props.forumMap == 1) &&
                        <Link key={ `${forumID}-${forumName}-map` } className="router-link" 
                        to={ `/Forum/${ forumName }/Map` } 
                        state={{ 
                            forumID: forumID,
                            forumName: forumName,
                        }}
                        >
                            <button className="forum-map" > Community Map </button>
                        </Link>
                    }

                    { 0 < tagList.length &&
                        <div className="side-bar-section side-bar-section-tags">
                            <div className="side-bar-section-title">
                                <h1>Tags</h1>
                            </div>
                            <div className="tag-list">
                                {tagList.map((tag, index) => (
                                    <h3 key={index}>{tag}</h3>
                                ))}
                            </div>
                        </div>
                    }

                    <div className="side-bar-section">
                        <Link key={ `${forumID}-${forumName}-report` } className="router-link" 
                        to={ `/Report-Content` } 
                        state={{ 
                            reportedID: forumID,
                            reportedName: forumName,
                            type: "Forum"
                        }}
                        >
                            <button className="forum-settings" > Report Forum </button>
                        </Link>

                    </div>

                    { (userRole == "Admin" || userRole == "Owner") && 
                        <div className="side-bar-section">
                            <div className="side-bar-section-title">
                                <h1>Admin Dash</h1>
                            </div>
                            <Link key={ `${forumID}-${forumName}-admin` } className="router-link" 
                            to={ `/Forum/${ forumName }/Admin-Dashboard` } 
                            state={{ 
                                forumID: forumID,
                                forumName: forumName,
                                forumMaps: props.forumMap,
                                userRole: userRole,
                                forumTags: props.forumTags
                            }}
                            >
                                <button className="forum-settings" > Community Settings </button>
                            </Link>

                        </div>
                    } 

                </div>
            </div>
        </>
    )
}

export default ForumLandingPage