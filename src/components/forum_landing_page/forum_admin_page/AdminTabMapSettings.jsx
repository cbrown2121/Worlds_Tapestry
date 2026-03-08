import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormElement from "../../form_component/FormElement.jsx";
import FormRow from "../../form_component/FormRow.jsx";
import "./ForumAdminPage.css";

function AdminTabMapSettings( props ) {
    const [forumID, setForumID] = useState(props.forumID);

    let mapLatSection = { type: "text", sectionTitle: "Center Latitude", sectionID:"latitude" };
    let mapLongSection = { type: "text", sectionTitle: "Center Longitude", sectionID:"longitude" };

    return (
        <>
            <FormElement formID="map-center" formTitle="Change Map Center" endPoint="map/update-lat-long" method="PUT" passToEndPoint={ [{key: "ForumID", value: forumID}] } submitButtonText="Submit" sections={ [mapLatSection, mapLongSection] } />
        </>
    )
}

export default AdminTabMapSettings