import { useState } from "react"
import "./ThreadPost.css"
// import ThreadPost from "./TheadPost"
import thumbsUpIcon from "../../../../assets/thumbs-up.svg"
import thumbsDownIcon from "../../../../assets/thumbs-down.svg"
import profile from "../../../../assets/profile.svg"

// feel free to change the attributes im just going for what works best for now
function ThreadPost({ subject, text, likeCount, dislikeCount, username}) {
    const [count, setCount] = useState(0)

  return (
    <>
        <div className="thread-post">
            <div className="post-left">
                <h1 className="post-subject">{subject}</h1>
                <p className="post-content">{text}</p>
                <div className="post-like-dislike-date">
                    <div className="ratings">
                        <div className="rating">
                            <img src={thumbsUpIcon} alt="" />
                            <p className="like-count">{likeCount}</p>
                        </div>
                        <div className="rating">
                            <img src={thumbsDownIcon} alt="" />
                            <p className="dislike-count">{dislikeCount}</p>
                        </div>
                    </div>
                    <p className="post-creation-day">xx/xx/xxxx</p>
                </div>
            </div>
            <div className="post-right">
                <div className="user-profile-mini">
                    <div className="user-major-details">
                        <img src={profile} alt="" className="user-profile" />
                        <div className="user-name-and-type">
                            <h1 className="user-name">{username}</h1>
                            <h2 className="user-type">User Type</h2>
                        </div>
                    </div>
                    <div className="user-minor-details">
                        <p className="forum-join-date">User since: xx/xx/xxxx</p>
                        <p className="thread-start-count">xxxx Posts</p>
                        <p className="forum-post-count">xxxx Threads started</p>
                    </div>
                </div>
                <button className="reply-to-post">Reply to Post</button>
            </div>
        </div>
    </>
  )
}

export default ThreadPost