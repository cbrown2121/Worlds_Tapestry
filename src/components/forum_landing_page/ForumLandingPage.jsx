import { useState, useEffect } from "react";
import "./ForumLandingPage.css";
import CategoryTab from "./CategoryTab";
import ForumSection from "./ForumSection";
import ForumTrendingTab from "./ForumTrendingTab";
import defaultIcon from "../../assets/commmunity-default-icon.svg";

function ForumLandingPage( forumID ) {
    const [forumName, setForumName] = useState(null)
    const [pinnedCategories, setPinnedCategories] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/forums/${forumID.forumID}`)
        .then(response => response.json())
        .then(forum => {
            setForumName(forum[0].ForumName); // change to be all data and also get the category data
        }).catch(error => console.error(error));

        
        fetch(`http://localhost:5000/categories/${forumID.forumID}`)
        .then(response => response.json())
        .then(categoryList => {
            createCategories(categoryList);
        }).catch(error => console.error(error));

    }, []);

    // { title: category.CategoryName, tags: ["1", "1"], threadCount: "0", postCount: "0", mostRecent: "NULL Ago"}

    const createCategories = (categoriesList) => {
        console.log(categoriesList)
        for (let i = 0; i < categoriesList.length; i++) {
            let category = categoriesList[i];
            if (category.Pinned == 1) { // category is pinned
                setPinnedCategories(pinnedCategories => [...pinnedCategories, {key: category.CategoryID, content: { title: category.CategoryName, tags: ["1", "1"], threadCount: "0", postCount: "0", mostRecent: "NULL Ago"}}] ); // change this to be better later. once the database is more accurate we can just pass the database object
            } else { // category is pinned
                setCategories(categories => [...categories, {key: category.CategoryID, content: { title: category.CategoryName, tags: ["1", "1"], threadCount: "0", postCount: "0", mostRecent: "NULL Ago"}}] );
            }
        }
    }

  return (
    <>
        {
            console.log(pinnedCategories)
        }
        {
             console.log(categories)
        }
        <div className="forum-landing-page landing-page">
            <div className="forum-landing-main landing-page-main">
                <ForumSection title="Pinned Categories" categoryTabsList=
                    {pinnedCategories.map((pinnedCategory) => (
                        <CategoryTab key={pinnedCategory.key} {...pinnedCategory.content} />
                    ))}
                />
                <ForumSection title="Categories" categoryTabsList=
                    {categories.map((category) => (
                        <CategoryTab key={category.key} {...category.content} />
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