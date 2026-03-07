import { useState, useEffect } from "react";
import { calculateRecency } from "../../utility.js";
import pinIcon from "../../assets/pin.svg";
import { Link } from 'react-router-dom';
import "./Tab.css";
import { useLocation } from 'react-router-dom';

// tags should be an array
function CategoryTab( props ) {
    const location = useLocation(); 
    const [recency, setRecency] = useState(null);

    useEffect(() => {
        setRecency(calculateRecency(props.MostRecentActivity))
    },[]);

    let categoryName = <div className="tab-name"><p className="tab-name-text">{props.CategoryName}</p></div>;;

    if (props.Pinned == 1) {
        categoryName = 
                        <div className="tab-name">
                            <p className="tab-name-text">{props.CategoryName}</p> 
                            
                            <img src={pinIcon} alt="pin" className="pinned-icon" /> 
                        </div>;
    }

    return (
        <>
            <Link className="router-link" 
                    to={ `${ location.pathname }/category/${ props.CategoryName.replace(/[ ]/g, "_") }` }  // change later so this includes the forum name from the previous link
                    state={{ 
                        forumID: props.ForumID,
                        categoryID: props.CategoryID, 
                        categoryName: props.CategoryName
                    }}
            >

                <div className="tab">
                    <div className="icon-or-image"></div>

                    <div className="tab-information">
                        {categoryName}
                        <div className="tab-description">
                            <p className="tab-description-text">{props.Description}</p>
                        </div>
                    </div>

                    <div className="tab-stats">    
                        <div className="tab-stats-numbers">
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
                            { recency != null &&
                                <p className="most-recent">Recent Activity {recency}</p>
                            }
                        </div>
                    </div>
                </div>
            </Link>
        </>
    )
}

export default CategoryTab