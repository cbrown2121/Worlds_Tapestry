import { useState } from "react"
import "./ThreadPost.css"
// import ThreadPost from "./TheadPost"
import thumbsUpIcon from "../../../../assets/thumbs-up.svg"
import thumbsDownIcon from "../../../../assets/thumbs-down.svg"
import profile from "../../../../assets/profile.svg"

// feel free to change the attributes im just going for what works best for now
function ThreadPost({ Subject, likecount, timemade, dislikecount, text, username, id, Replies, Status }) {
    const [count, setCount] = useState(0)
    const [like, Upvote] = useState(likecount)
    const [dislike, Downvote] = useState(dislikecount)

    const likeupdate = async () => {
        let newlike = like
        let newdis = dislike
        let tempbody = { postID: id, likes: newlike, dislikes: newdis }

        try { // submit to posts table to update data
            const response = await fetch("http://localhost:5000/posts/update-like-dislike", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(tempbody),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            console.log(tempbody)
            console.log(`Data was submitted successfully: ${result}`);

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }
    }

    const upclicked = () => {
        Upvote(like + 1);
    }

    const downclick = () => {
        Downvote(dislike + 1);
    }


    return (
        <>
            <div className="thread-post">
                <div className="post-left">
                    {/* <h1 className="post-subject">{subject}</h1> */}
                    <p className="post-content">{text}</p>
                    <div className="post-like-dislike-date">
                        <div className="ratings">
                            <div className="rating">
                                <button type="button" id="Like" onClickCapture={upclicked} onClick={likeupdate}><img src={thumbsUpIcon} alt="upward arrow" /></button>
                                <p className="like-count">{like}</p>
                            </div>
                            <div className="rating">
                                <button type="button" id="Dislike" onClickCapture={downclick} onClick={likeupdate}><img src={thumbsDownIcon} alt="downward arrow" /></button>
                                <p className="dislike-count">{dislike}</p>
                            </div>
                        </div>
                        <p className="post-creation-day">{timemade}</p>
                    </div>
                </div>
                <div className="post-right">
                    <div className="user-profile-mini">
                        <div className="user-major-details">
                            <img src={profile} alt="" className="user-profile" />
                            <div className="user-name-and-type">
                                <h1 className="user-name">{username}</h1>
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