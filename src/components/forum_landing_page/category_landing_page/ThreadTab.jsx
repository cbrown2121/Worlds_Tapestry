import { useState } from "react";
import categoryImage from "../../../assets/commmunity-default-icon.svg";
import { Link } from 'react-router-dom';
// import "../";
import { useLocation } from 'react-router-dom';

function ThreadTab( props ) {
    const location = useLocation();

    return (
        <>
            <Link className="router-link" 
                    to={ `${ location.pathname }/thread/${props.ThreadName.replace(/[ ]/g, "_")}` }  // change later so this includes the forum name from the previous link
                    state={{ 
                        threadID: props.ThreadID
                    }}
            >
                <div className="thread-tab">
                    <img src={categoryImage} alt="" className="thread-image" />

                    <table className="thread-info">
                        <tbody className="thread-info-details">
                            <tr>
                                <td className="thread-name-text">{props.ThreadName}</td>
                                <td className="thread-post-count">{props.NumberOfPosts}</td>
                                <td className="thread-recency-time">{0}</td>
                            </tr>
                            <tr>
                                <td className="thread-tags-text">#Tag</td>
                                <td>Posts/Replies</td>
                                <td>Most Recent</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Link>
        </>
    )
}

export default ThreadTab