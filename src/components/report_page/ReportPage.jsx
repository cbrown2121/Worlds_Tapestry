import { useState, useContext } from "react"
import { UserContext } from "../../contexts/Context.jsx";
import { ReportForm } from "../form_component/ReportForm.jsx";


const ReportPage = () => {
    return (
        <>
            <div id="content-report-page" className="main-content">
                <ReportForm/>
            </div>
        </>
    )
}

export default ReportPage;