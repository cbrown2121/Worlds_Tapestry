import { useState } from "react";
import categoryImage from "../../assets/commmunity-default-icon.svg";
import { Link } from 'react-router-dom';
import "./CategoryTab.css";
import { useLocation } from 'react-router-dom';

// tags should be an array
function CategoryTab( props ) {
    const location = useLocation();
    let tagsText = "";

    // for (let i = 0; i < props.tags.length; i++) {
    //     tagsText += `#${props.tags[i]}`;

    //     (i + 1 < props.tags.length ? tagsText += ", " : null);
    // }

    return (
        <>
            <Link className="router-link" 
                    to={ `${ location.pathname }/category/${ props.CategoryName.replace(/[ ]/g, "_") }` }  // change later so this includes the forum name from the previous link
                    state={{ 
                        forumID: props.ForumID,
                        categoryID: props.CategoryID
                    }}
            >
                <div className="forum-category-tab">
                    <img src={categoryImage} alt="" className="category-image" />

                    <table className="category-info">
                        <tbody className="category-info-details">
                            <tr>
                                <td className="category-name-text">{props.CategoryName}</td>
                                <td className="category-thread-count">{props.NumberOfThreads}</td>
                                <td className="category-post-count">{props.NumberOfPosts}</td>
                                <td className="category-recency-time">{props.mostRecent}</td>
                            </tr>
                            <tr>
                                <td className="category-tags-text">{props.tagsText}</td>
                                { props.NumberOfThreads == 1 && 
                                <td>Thread</td> // maybe just do an if statement at the start instead of all this.. sorry for the mess for now we can clean up later
                                }
                                { props.NumberOfThreads != 1 && 
                                <td>Threads</td>
                                } 
                                { props.NumberOfPosts == 1 && 
                                <td>Post/Reply</td>
                                }
                                { props.NumberOfPosts != 1 && 
                                <td>Posts/Replies</td>
                                } 
                                <td>Most Recent</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Link>
        </>
    )
}

export default CategoryTab