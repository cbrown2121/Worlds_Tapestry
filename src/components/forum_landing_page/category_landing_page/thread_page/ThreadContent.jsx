import { useState, useEffect } from "react";
import "./ThreadPage.css";
import ThreadPost from "./TheadPost.jsx";

function ThreadContent(props) {
    // const [forumID, setForumID] = useState(props.forumID);
    const [threadID, setThreadID] = useState(props.threadID);
    const [posts, setPosts] = useState([]);
    // const [ThreadList, setThread] = useState([])
    useEffect(() => {
            fetch(`http://localhost:5000/posts/${threadID}`) // change later to not be on local host
            .then(response => response.json())
            .then(postList => {
                setPosts(postList)
            }).catch(error => console.error(error));
        }, []);

  return (
    <>
        <div className="thread-page">
            <div className="thread-header">
                <div className="thread-name-count">
                    <h1 className="thread-name">Topic Name</h1>
                    <h2 className="thread-post-count">10 Posts by 6 users</h2>
                </div>
            </div>
            {posts.map((post) => (
                <ThreadPost key={post.PostID} {...post}/>
            ))}
        </div>
    </>
  )
}

export default ThreadContent