import { useState, useEffect } from "react"
import "./Form.css"

function FormTextSection( props ) {
    const [sectionInputs, setSectionInputs] = useState(null);
    // props = sectionTitle=text type=text options: {[id value text checked (if type is radio)]}

    return (
        <>
            <div className="form-section form-text-section">
                    <div className="section-heading">
                        <h2 className="forum-section-header">{ props.sectionTitle }</h2>
                    </div>
                    <div className="section-options">
                        <input type="text" id={ props.sectionID } name={ props.sectionID }/>
                    </div>
            </div>
        </>
    )
}

export default FormTextSection