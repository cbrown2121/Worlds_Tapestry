import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import "./ForumAdminPage.css";
import { ForumContext } from "../../../contexts/Context.jsx";

function AdminTabMapSettings() {
    const [forum] = useState(ForumContext);

    let mapLatSection = { type: "text", sectionTitle: "Center Latitude", sectionID:"latitude" };
    let mapLongSection = { type: "text", sectionTitle: "Center Longitude", sectionID:"longitude" };

    return (
        <>
            <FormElement formID="map-center" formTitle="Change Map Center" endPoint="map/update-lat-long" method="PUT" passToEndPoint={ [{key: "ForumID", value: forum.ForumID}] } submitButtonText="Submit" sections={ [mapLatSection, mapLongSection] } />
        </>
    )
}

export default AdminTabMapSettings