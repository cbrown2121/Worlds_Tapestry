import { useState, useEffect } from "react"
import FormTextSection from "./FormTextSection.jsx";
import FormRadioSection from "./FormRadioSection.jsx";
import "./Form.css"

function FormElement( props ) {
    const [sections, setSections] = useState( props.sections );
    const sampleUserID = 1;

    const handleSubmit = async (event) => {
        event.preventDefault();

        let processedData = {};

        new FormData(event.currentTarget).forEach((value, key) => {
            processedData[key] = value;
        });

        for (let i = 0; i < props.passToEndPoint.length; i++) {
            let keyPair = props.passToEndPoint[i];
            processedData[keyPair.key] = keyPair.value;
        }

        console.log(processedData);

        try {
            const response = await fetch(`http://localhost:5000/${ props.endPoint }`, {
                method: props.method,
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(processedData),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            console.log(result);

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        window.location.reload(); // reload window to show data change
    }

    return (
        <>
            <div id={props.formID} className="form-component">
                <h1 className="form-title"> { props.formTitle } </h1>
                <form onSubmit={ handleSubmit } action="">

                    {sections.map((section) => {
                        if (section.type == "text") {
                            return <FormTextSection key={ section.sectionID } {...section} />
                        } else if (section.type == "radio") {
                            return <FormRadioSection key={ section.sectionID } {...section} />
                        }
                    })}

                    <button className="submit-form-button" type="submit"> { props.submitButtonText } </button>
                </form>
                
            </div>
        </>
    )
}

export default FormElement