import { useState, useEffect } from "react";
import "./ForumLandingPage.css";
import CategoryTab from "./CategoryTab";
import ForumSection from "./ForumSection";
import ForumTrendingTab from "./ForumTrendingTab";
import defaultIcon from "../../assets/commmunity-default-icon.svg";

function ForumLandingPage( props ) {
    const [forumID] = useState(props.forumID)
    const [forumName] = useState(props.forumName)
    const [pinnedCategories, setPinnedCategories] = useState([]);
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
                setPinnedCategories(pinnedCategories => [...pinnedCategories, {...category}] ); // change this to be better later. once the database is more accurate we can just pass the database object
            } else { // category is pinned
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
            

        } else { // user is leaving the forum. in the future there should be more depending on the role since leaving should be more involved if theyre the forum owner
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
    }

  return (
    <>
        <div className="forum-landing-page landing-page">
            <div className="forum-landing-main landing-page-main">
                <ForumSection title="Pinned Categories" categoryTabsList=
                    {pinnedCategories.map((pinnedCategory) => (
                        <CategoryTab key={pinnedCategory.CategoryID} {...pinnedCategory} />
                    ))}
                />
                <ForumSection title="Categories" categoryTabsList=
                    {categories.map((category) => (
                        <CategoryTab key={category.CategoryID} {...category}/>
                    ))}
                />
            </div>
            <div className="forum-landing-side landing-page-side">
                <div className="forum-information-stats landing-page-information-stats">
                    <img src={defaultIcon} alt="" className="forum-image" />
                    <div className="forum-stats landing-page-stats">
                        <h2 className="forum-name landing-page-name">{ forumName }</h2>
                        <h3 className="user-count">13,078</h3>
                        <h3 className="users-online">548</h3>
                        <h3 className="thread-count-stats">8,756</h3>
                        <h3 className="creation-data">xx/xx/xxxx</h3>
                    </div>
                </div>
                <div className="forum-highlights landing-page-highlights">
                    <button id="forumJoin" onClick={ joinButtonAction }> {joinButtonText} </button>
                    <ForumTrendingTab trendingTitle="Most Popular Category of the Day" trendingName="Category Name" trendingDetails="564 Posts Today" />
                    <ForumTrendingTab trendingTitle="Featured Post" trendingName="Post Title" trendingDetails="Details" />
                    <ForumTrendingTab trendingTitle="Most Post Category of the Day" trendingName="Post Title" trendingDetails="132 Replies" />
                </div>
            </div>
        </div>
    </>
  )
}

export default ForumLandingPage