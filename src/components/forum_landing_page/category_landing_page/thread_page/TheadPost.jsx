import { useState } from "react"
import "./ThreadPost.css"
// import ThreadPost from "./TheadPost"
import thumbsUpIcon from "../../../../assets/thumbs-up.svg"
import thumbsDownIcon from "../../../../assets/thumbs-down.svg"
import profile from "../../../../assets/profile.svg"

function ThreadPost( props ) {
    const [likeCount, Upvote] = useState(props.likes)
    const [dislikeCount, Downvote] = useState(props.dislikes)

    const ratingUpdate = async (likeValue, dislikeValue) => {
        try { // submit to posts table to update data
            const response = await fetch(`http://localhost:5000/posts/${props.PostID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ likes: likeValue, dislikes: dislikeValue }),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }
    }

    const upclicked = () => {
        ratingUpdate(likeCount + 1, dislikeCount);
        Upvote(likes => likes + 1);
    }

    const downclick = () => {
        ratingUpdate(likeCount, dislikeCount + 1);
        Downvote(dislikes => dislikes + 1);
    }

    return (
        <>
            <div className="thread-post">
                <div className="post-left">
                    {/* <h1 className="post-subject">{subject}</h1> */}
                    <p className="post-content">{ props.Content }</p>
                    <div className="post-like-dislike-date">
                        <div className="ratings">
                            <div className="rating">
                                <button type="button" id="Like" onClick={ upclicked }><img src={thumbsUpIcon} alt="upward arrow" /></button>
                                <p className="like-count">{likeCount}</p>
                            </div>
                            <div className="rating">
                                <button type="button" id="Dislike" onClick={ downclick }><img src={thumbsDownIcon} alt="downward arrow" /></button>
                                <p className="dislike-count">{dislikeCount}</p>
                            </div>
                        </div>
                        <p className="post-creation-day">{ props.Creation_Date }</p> 
                    </div>
                </div>
                <div className="post-right">
                    <div className="user-profile-mini">
                        <div className="user-major-details">
                            <img src={profile} alt="" className="user-profile" />
                            <div className="user-name-and-type">
                                <h1 className="user-name">{ props.Creator }</h1>
                                <h2 className="user-type">User</h2>
                            </div>
                        </div>
                        <div className="user-minor-details">
                            {/* <p className="forum-join-date">User since: xx/xx/xxxx</p>
                        <p className="thread-start-count">xxxx Posts</p>
                        <p className="forum-post-count">xxxx Threads started</p> */}
                        </div>
                    </div>
                    <button className="reply-to-post" >Reply to Post</button>
                </div>
            </div>
        </>
    )
}

export default ThreadPost