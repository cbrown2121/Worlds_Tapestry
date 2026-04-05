import { useState, useEffect, useContext } from "react";
import FormElement from "../form_component/FormElement";
import "./FooterLinkPages.css";
import { ForumContext, UserContext } from "../../contexts/Context";
import FormTextSection from "../form_component/FormTextSection";

const BugReportPage = () => {
    const { user, loggedIn } = useContext(UserContext);;

    return (
        <>
            <div className="main-content"> { /* you can add more classes or an id but the class must be main-content for spacing */ }
                <FormElement formTitle="Bug Reporting" endPoint="bug-reports" method="POST" passToEndPoint={ [{key: "SubmitterID", value: user.UserID}] } >
                    <FormTextSection type="text" sectionTitle="Describe your issue" sectionID="Subject"/>
                    <button type="submit" className="bug-report-submit-button">Submit</button>
                </FormElement>
            </div>
        </>
    )
}

export default BugReportPage;