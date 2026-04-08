import { useState } from "react";
import { convertFormToData, universalDatabaseFetch, universalFormSubmit } from "../../utility";
import "./FloatingForm.css"
import { useNavigate } from "react-router-dom";

function FloatingForm({children, onExit, endpoint, method, passToEndPoint }) { // made specifically for community creation
    const [state, setState] = useState("progress");
    const [newForumName, setNewForumName] = useState("progress");
    const [formKey, setNewFormKey] = useState(1);
    const navigate = useNavigate();

    let exitIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#ffffff"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z" fill="#ffffff"/></svg>;


    const handleSubmit = (event) => {
        event.preventDefault();

        let processedData = convertFormToData(event, passToEndPoint);
        let nameInputField = document.querySelector("form #ForumName");

        universalDatabaseFetch(`forum/${processedData.ForumName}`).then((nameCheckData) => {
            if(nameCheckData == undefined) {
                setState("error");
                return;
            } else if (!nameCheckData.successful) {
                setState("error");
                return;
            } else {
                setNewForumName(processedData.ForumName);
            }

            if (0 < nameCheckData.results.length) {
                console.log("invalid");
                nameInputField.setCustomValidity(`${processedData.ForumName} is already in use.`);
                nameInputField.reportValidity();
            } else {
                universalFormSubmit(event, "forums", "POST", processedData).then((data) => {
                    console.log(data);
                    if (!data) {
                        setState("error");
                    } else {
                        setState("finished");
                    }
                });
            }
        });

        return;
    }

    return (
        <>
            <div className="overlay-effect"></div>
            <div className="floating-form form-component">
                <div className="floating-form-contents">
                    <button className="form-exit-button" onClick={() => onExit()}>{exitIcon}</button>
                    <div className="floating-form-area">
                        { state == "progress" &&
                            <form key={formKey} className="form-details" onSubmit={handleSubmit}>
                                {children}
                            </form>
                        }

                        { state == "error" &&
                            <div className="form-error-message form-message">
                                There was an error processing your request. Please try again later.

                                <button onClick={() => window.location.reload("")} className="form-error">Reload Webpage</button>
                            </div>
                        }

                        { state == "finished" &&
                            <div className="forum-finished-message form-message">
                                Community created successfully.

            
                                <button onClick={() => navigate(`/Forum/${newForumName}`)} className="go-to-new-forum">Go to community</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default FloatingForm;