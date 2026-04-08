import { useState, useEffect, useContext, componentDidMount } from "react"
import FormTextSection from "./FormTextSection.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import FormSelectionSection from "./FormSelectionSection.jsx";
import { UserContext } from "../../contexts/Context.jsx";
import { universalDatabaseFetch, universalDatabaseInteraction } from "../../utility.js";
import FormElement from "./FormElement.jsx";
import "./Form.css"

export const ReportForm = (props) => { // form that is centered in the middle of the page
    const state = useLocation().state;

    const { user, setUser } = useContext(UserContext);
    const [type] = useState(state.type);
    const [reportedID] = useState(state.reportedID);
    const [reportedName] = useState(state.reportedName);
    
    console.log(state)

    let issueField = {  };

    const navigate = useNavigate(); 
    
    return (
        <>
            <div className="form-component content-report-form">
                <FormElement formTitle={`Report ${type} ${reportedName}`} endPoint="content-reports" method="POST" passToEndPoint={ [{key: "SubmitterID", value: user.UserID}, {key:"ReportedID", value: reportedID}, {key:"ReportType", value: type}] }>
                    <FormTextSection type="text" sectionTitle="Describe your issue" sectionID="Subject"/>
                    <button type="submit" className="report-form">Submit</button>
                </FormElement>
            </div>
        </>
    )
}