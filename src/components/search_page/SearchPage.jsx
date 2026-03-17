import { useState, useEffect } from "react"
import { universalDatabaseFetch } from "../../utility.js";
import CommunityTab from "../landing_page/CommunityTab";
import CategoryTab from "../forum_landing_page/CategoryTab";
import ThreadPost from "../forum_landing_page/category_landing_page/ThreadTab.jsx";
import "./SearchPage.css";
 
const SearchPage = () => {
    const path = window.location.pathname;
    const pathStart = `/Search/`;
    let queryStartIndex = [path.indexOf(pathStart) + pathStart.length];

    const [query] = useState(path.substring(queryStartIndex));

    const [forums, setForums] = useState([]);
    const [categories, setCategories] = useState([]);
    const [threads, setThreads] = useState([]);
    const [posts, setPosts] = useState([]);
    const [user, setUsers] = useState([]);

    // const sampleForumId = 1;
    // const sampleUserId = 1;

    // const requestForAllForums = `http://localhost:5000/forums`; // only for testing purposes
    // const requestForUserForums = `http://localhost:5000/usersforums/${sampleForumId}`; // the route that will be used in the final deployment
    
    useEffect(() => {
        const fetchQueryResults = async () => {
            setForums(await universalDatabaseFetch(`search-forums/${query}`));
            setCategories(await universalDatabaseFetch(`search-categories/${query}`));
            setPosts(await universalDatabaseFetch(`search-posts/${query}`));
            setThreads(await universalDatabaseFetch(`search-threads/${query}`));
            setUsers(await universalDatabaseFetch(`search-users/${query}`));
        }

        fetchQueryResults();
    }, []);

    return (
        <>
            <div className="main-content">
                <div className="forum-matches">   { /* searches forum name and tags */ }
                    {forums.map((forum) => {
                        return <CommunityTab key={ forum.ForumID } {...forum} />
                    })}
                </div>

                <div className="category-matches">  { /* searches category description */ }
                    {categories.map((category) => {
                        return <CategoryTab key={category.CategoryID} {...category} />
                    })}
                </div>

                <div className="thread-matches"> { /* only first post in thread searches content (should search subject as well once subject is implemented) */ }
                    {threads.map((thread) => {
                        return <ThreadPost key={thread.ThreadID} {...thread}/>
                    })}
                </div>

                <div className="post-matches">  { /* searches content of all non original thread posts */ }
                    {posts.map((post) => {
                        return <ThreadPost key={`${post.ThreadID}-${post.PostID}`} {...post}/>
                    })}
                </div>
            </div>
        </>
    )
}

export default SearchPage