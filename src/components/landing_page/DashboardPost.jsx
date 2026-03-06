import { useState, useEffect } from "react";
import bookIcon from "../../assets/book-icon.svg";
import "./DashboardPost.css";
import CommunityTab from "./CommunityTab.jsx";
import TrendingTab from "./TrendingTab.jsx";
import FormElement from "../form_component/FormElement.jsx";

// for now the "my communities" section is all the forums in our database

const DashBoardPost = ( props ) => {
    
    return (
        <>
            <div className="dashboard-post-contents">
                <div className="dashboard-post">
                    <div className="dashboard-post-header">
                        <p className="dashboard-poster-username">
                            { props.UserName }
                        </p>
                        <div className="dashboard-poster-icon"></div>
                    </div>
                    <div className="dashboard-post-content">
                        { props.Content }
                    </div>
                    <div className="dashboard-post-footer">

                    </div>
                </div>

                <div className="dashboard-post-links">
                    <button>Go To Post</button>
                    <button>Go To Forum</button>
                </div>
            </div>
        </>
    )
}

export default DashBoardPost