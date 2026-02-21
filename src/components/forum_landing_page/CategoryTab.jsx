import { useState } from "react";
import categoryImage from "../../assets/commmunity-default-icon.svg";
import { Link } from 'react-router-dom';
import "./CategoryTab.css";
import { useLocation } from 'react-router-dom';

// tags should be an array
function CategoryTab( props ) {
    const location = useLocation();
    let tagsText = "";

    for (let i = 0; i < props.tags.length; i++) {
        tagsText += `#${props.tags[i]}`;

        (i + 1 < props.tags.length ? tagsText += ", " : null);
    }

    return (
        <>
            <Link className="router-link" 
                    to={ `${ location.pathname }/category/${ props.title.replace(/[ ]/g, "_") }` }  // change later so this includes the forum name from the previous link
                    state={{ 
                        forumID: props.forumID,
                        categoryID: props.categoryID
                    }}
            >
                <div className="forum-category-tab">
                    <img src={categoryImage} alt="" className="category-image" />

                    <table className="category-info">
                        <tbody className="category-info-details">
                            <tr>
                                <td className="category-name-text">{props.title}</td>
                                { props.threadCount != undefined && 
                                <td className="category-thread-count">{props.threadCount}</td>
                                }
                                <td className="category-post-count">{props.postCount}</td>
                                <td className="category-recency-time">{props.mostRecent}</td>
                            </tr>
                            <tr>
                                <td className="category-tags-text">{props.tagsText}</td>
                                { props.threadCount != undefined && 
                                <td>Threads</td>
                                } 
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

export default CategoryTab