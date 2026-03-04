import { useState, useEffect } from "react";
import { calculateRecency } from "../../utility.js";
import pinIcon from "../../assets/pin.svg";
import { Link } from 'react-router-dom';
import "./CategoryTab.css";
import { useLocation } from 'react-router-dom';

// tags should be an array
function CategoryTab( props ) {
    const location = useLocation(); 
    const [recency, setRecency] = useState(null);

    console.log(props)

    useEffect(() => {
        setRecency(calculateRecency(new Date(), new Date(props.MostRecentActivity)))
    },[]);

    let categoryName = <div className="category-name"><p className="category-name-text">{props.CategoryName}</p></div>;;

    if (props.Pinned == 1) {
        categoryName = 
                        <div className="category-name">
                            <p className="category-name-text">{props.CategoryName}</p> 
                            
                            <img src={pinIcon} alt="pin" className="pinned-icon" /> 
                        </div>;
    }

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
                    <div className="icon-or-image"></div>

                    <div className="category-information">
                        {categoryName}
                        <div className="category-description">
                            <p className="category-description-text">{props.Description}</p>
                        </div>
                    </div>

                    <div className="category-stats">    
                            <div className="category-stats-numbers">
                                <div className="thread-count">
                                    <p className="number-of-threads">{props.NumberOfThreads}</p>
                                    <div className="thread-count-label">
                                        { props.NumberOfThreads != 1 && 
                                        <>Threads</>
                                        } 

                                        { props.NumberOfThreads == 1 && 
                                        <>Thread</>
                                        } 
                                    </div>
                                </div>
                                <div className="post-count">
                                    <p className="number-of-posts">{props.NumberOfPosts}</p>
                                        { props.NumberOfPosts != 1 && 
                                        <>Posts</>
                                        } 

                                        { props.NumberOfPosts == 1 && 
                                        <>Post</>
                                        } 
                                </div>
                            </div>
                            <div className="most-recent-activity">
                                <p className="most-recent">Recent Activity {recency}</p>
                            </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default CategoryTab