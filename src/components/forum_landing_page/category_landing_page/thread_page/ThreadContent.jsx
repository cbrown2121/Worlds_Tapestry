import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import "./ThreadContent.css";
import ThreadPost from "./TheadPost.jsx";

function ThreadContent(props) {
    const state = useLocation().state;
    const sampleUserID = 1;
    // const [forumID, setForumID] = useState(props.forumID);
    const [threadID, setThreadID] = useState(state.threadID);
    const [posts, setPosts] = useState([]);
    const [ThreadList, setThread] = useState([])
    useEffect(() => {
            fetch(`http://localhost:5000/posts/${threadID}`) // change later to not be on local host
            .then(response => response.json())
            .then(postList => {
                setPosts(postList)
            }).catch(error => console.error(error));
        }, []);
    // const makePost = async (likeValue, dislikeValue, rating) => {
    //     try { // submit to posts table to update data
    //         const response = await fetch(`http://localhost:5000/posts`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({creator : sampleUserID, creation_date : Now(), status : "unlocked", replies : null, content : text, likes : 0, dislikes : 0, subject : Header }),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Network response error");
    //         }

    //     } catch (error) {
    //         console.log(`Data was submitted unsuccessfully: ${error}`);
    //     }
    // }
    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userId = props.userID; // demo user

        let userData = {creator : sampleUserID,thread_id : threadID, creation_date : Date.now(), status : "unlocked", replies : "", content : formData.get("postbody"), likes : 0, dislikes : 0, subject : formData.get("Header"), }
        
        try {
            const response = await fetch(`http://localhost:5000/posts`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            console.log(`Data was submitted successfully: ${userData}`);

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        window.location.reload(); // reload window to show that profile has been updated.
    }

  return (
    <>
        <div className="thread-page main-content">
            <div className="thread-header">
                <div className="thread-name-count">
                    <h1 className="thread-name">Topic Name</h1>
                    <h2 className="thread-post-count">{posts.length} Posts</h2>
                </div>
                <div id="profile-update">
                <h1 id="profile-update-title">Create a new post</h1>
                <form onSubmit={handleSubmit} action="" id="new-post-form">
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="form-section-header">Subject</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="Header" name="Header" placeholder="Put a short subject description here."/>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="form-section-header">Post</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="postbody" name="postbody" placeholder="Write your post here."/>
                        </div>
                    </div>
                    <button className="profile-update-button" type="submit">Submit</button>
                </form>
                
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