import { useState, useEffect, useContext } from "react";
import FormElement from "../form_component/FormElement";
import "./FooterLinkPages.css";
import { ForumContext, UserContext } from "../../contexts/Context";

const BugReportPage = () => {
    const { user, loggedIn } = useContext(UserContext);;

    let issueField = { type: "text", sectionTitle: "Describe your issue", sectionID:"Subject" };

    return (
        <>
            <div className="main-content"> { /* you can add more classes or an id but the class must be main-content for spacing */ }
                <FormElement  formTitle="Bug Reporting" endPoint="bug-reports" method="POST" passToEndPoint={ [{key: "SubmitterID", value: user.UserID}] } submitButtonText="Submit" sections={ [issueField] } />
            </div>
        </>
    )
}

export default BugReportPage;