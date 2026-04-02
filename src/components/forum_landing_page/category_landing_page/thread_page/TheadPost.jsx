import { useState, useEffect, useId, useContext } from "react"
import "./ThreadPost.css"
// import ThreadPost from "./TheadPost"
import thumbsUpIcon from "../../../../assets/thumbs-up.svg"
import thumbsDownIcon from "../../../../assets/thumbs-down.svg"
import profile from "../../../../assets/profile.svg"
import { UserContext } from "../../../../contexts/Context.jsx"
import { calculateRecency, getDate } from "../../../../utility.js";
import FormElement from "../../../form_component/FormElement.jsx";
import { Link } from "react-router-dom"

const ThreadPost = (props) => {
    const { user } = useContext(UserContext);
    const modalID = useId();
    const [text, setText] = useState("");
    const [likeCount, Upvote] = useState(props.Likes);
    const [dislikeCount, Downvote] = useState(props.Dislikes);

    const [likeButtonStatus, setLikeButtonStatus] = useState(document.getElementById("not-active")); // keeps track of if a user has liked a post
    const [dislikeButtonStatus, setDislikeButtonStatus] = useState(document.getElementById("not-active")); // keeps track of if a user has disliked a post
    let forumTextSection = { type: "text", sectionTitle: "Post Content", sectionID:"content"};
    // check if the user is in the post ratings list to see if they have already interacted with a post
    useEffect(() => {
        fetch(`http://localhost:5000/post-ratings/${props.PostID}/${user.UserID}`)
            .then(response => response.json())
            .then(response => {
                if (0 < response.length) { // the user has interacted with the post
                    if (response[0].Rating == "like") {
                        setLikeButtonStatus("active");
                    } else if (response[0].Rating == "dislike") { // a rating can only be like or dislike. the ifelse is just done to be safe
                        setDislikeButtonStatus("active");
                    }
                }
            }).catch(error => console.error(error));
    }, []);

    const ratingUpdate = async (likeValue, dislikeValue, rating) => {
        try { // submit to posts table to update data
            const response = await fetch(`http://localhost:5000/change-post-rating`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ postID: props.PostID, likes: likeValue, dislikes: dislikeValue, userID: user.UserID, rating: rating }),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }
    }

    const interactWithLike = (buttonStatus, likeValue, rating) => {
        setLikeButtonStatus(buttonStatus); // status determines if the button is highlighted or not
        ratingUpdate(likeCount + likeValue, dislikeCount, rating);
        Upvote(likes => likes + likeValue);
    }

    const interactWithDislike = (buttonStatus, dislikeValue, rating) => {
        setDislikeButtonStatus(buttonStatus);
        ratingUpdate(likeCount, dislikeCount + dislikeValue, rating);
        Downvote(dislikes => dislikes + dislikeValue);
    }

    const upclicked = () => {
        if (likeButtonStatus == "active") { // user already liked the post
            interactWithLike("not-active", -1, "remove"); // remove like
        } else {
            if (dislikeButtonStatus == "active") { // user already disliked the post
                interactWithDislike("not-active", -1, "remove"); // remove dislike ======================================================================= currently buggy
            }

            interactWithLike("active", 1, "like"); // add like
        }
    }

    const downclick = () => {
        if (dislikeButtonStatus == "active") { // user already disliked the post
            interactWithDislike("not-active", -1, "remove"); // remove dislike
        } else {
            if (likeButtonStatus == "active") { // user already liked the post
                interactWithLike("not-active", -1, "remove"); // remove like ============================================================================= currently buggy
            }

            interactWithDislike("active", 1, "dislike"); // add dislike
        }
    }

    const deletepost = async () => {
        try { // submit to posts table to update data
            const response = await fetch(`http://localhost:5000/posts/${props.PostID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Deleted: 1 }),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }
        window.location.reload(); // reload window to show that post has been deleted.
    }

    const editpost = async () => {
        try { // submit to posts table to update data
            const response = await fetch(`http://localhost:5000/posts/${props.PostID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ Content: text + "     This post has been edited." }),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }
        window.location.reload(); // reload window to show that post has been updated.
    }

    return (
        <>
            <div className="thread-post">
                <div className="post-left">
                     <h1 className="post-subject">{props.Subject}</h1> 
                    <p className="post-content">{props.Content}</p>
                    <div className="post-like-dislike-date">
                        <div className="ratings">
                            <div className="rating">
                                <button type="button" className={likeButtonStatus} onClick={upclicked}><img src={thumbsUpIcon} alt="upward arrow" /></button>
                                <p className="like-count">{likeCount}</p>
                            </div>
                            <div className="rating">
                                <button type="button" className={dislikeButtonStatus} onClick={downclick}><img src={thumbsDownIcon} alt="downward arrow" /></button>
                                <p className="dislike-count">{dislikeCount}</p>
                            </div>
                        </div>
                        <p className="post-creation-day">{getDate(props.Created_Time)}</p>
                    </div>
                </div>
                <div className="post-right">
                    <div className="user-profile-mini">
                        <div className="user-major-details">
                            <img src={profile} alt="" className="user-profile" />
                            <div className="user-name-and-type">
                                <h1 className="user-name">{props.UserName}</h1>
                                <h2 className="user-type">User</h2>
                            </div>
                        </div>
                        <div className="user-minor-details">

                        </div>
                    </div>
                    {user.UserID == props.UserID &&
                        <>
                            <div className="delete-edit-report">
                                <button className="delete-button" onClick={deletepost}>Delete</button>
                                <button className="edit-button" command="show-modal" commandfor={modalID}>Edit</button>
                            </div>
                            <dialog id={modalID} className="edit-field" >
                                <div className="edit-container"><input
                                    className="text-field"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder={props.Content}
                                    name="ContentEdit"
                                />
                                    <button onClick={editpost} className="submit">
                                        Submit
                                    </button>
                                    <button className="Close" command="close" commandfor={modalID} value="cancel">
                                        Close
                                    </button></div>
                            </dialog>
                        </>
                    }

                    {user.UserID != props.UserID &&
                        <>
                            <div className="delete-edit-report">
                                <button className="reply-to-post" command="show-modal" commandfor={modalID}>Reply</button>
                                <Link key={`${props.postID}-report`} className="router-link"
                                    to={`/Report-Content`}
                                    state={{
                                        reportedID: props.PostID,
                                        reportedName: `by user ${props.UserName}`,
                                        type: "Post"
                                    }}
                                >
                                    <button className="report-button" > Report</button>
                                </Link>
                            </div>
                            <dialog id={modalID} className="reply-field">
                                 <FormElement  formTitle="Reply" method="POST" endPoint="reply" passToEndPoint={ [{key: "creator", value: user.UserID}, {key: "thread_id", value: props.ThreadID},{key: "subject", value: "Reply to: " + props.UserName}] } submitButtonText="Reply" sections={ [forumTextSection] } />
                            </dialog>
                        </>
                    }

                </div>
            </div>
        </>
    )
}

export default ThreadPost