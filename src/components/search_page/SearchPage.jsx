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
                <h1 className="results-title">
                    Search Results for: { query }
                </h1>
                <div className="forum-matches search-results">   { /* searches forum name and tags */ }
                    <h1 className="forum-matches-title">Forums</h1> 
                    
                    { 0 < forums.length &&
                        forums.map((forum) => {
                            return <CommunityTab key={ forum.ForumID } {...forum} />
                        })
                    }

                    { forums.length == 0 &&
                        <>No forums found</>
                    }

                </div>

                <div className="category-matches search-results">  { /* searches category description */ }
                    <h1 className="category-matches-title">Categories</h1>

                    { 0 < categories.length &&
                        categories.map((category) => {
                            return <CategoryTab key={category.CategoryID} {...category} />
                        })
                    }

                    { categories.length == 0 &&
                        <>No categories found</>
                    }

                </div>

                <div className="thread-matches search-results"> { /* only first post in thread searches content (should search subject as well once subject is implemented) */ }
                    <h1 className="threads-matches-title">Threads</h1>

                    { 0 < threads.length &&
                        threads.map((thread) => {
                            return <ThreadPost key={`${thread.ThreadID}-${thread.ForumID}`} {...thread}/>
                        })
                    }

                    { threads.length == 0 &&
                        <>No threads found</>
                    }

                </div>

                <div className="post-matches search-results">  { /* searches content of all non original thread posts */ }
                    <h1 className="post-matches-title">Posts</h1>

                    { 0 < posts.length &&
                        posts.map((post) => {
                            return <ThreadPost key={`${post.ThreadID}-${post.PostID}`} {...post}/>
                        })
                    }

                    { posts.length == 0 &&
                        <>No post found</>
                    }

                </div>
            </div>
        </>
    )
}

export default SearchPage;