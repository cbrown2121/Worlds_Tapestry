import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

function FormRow( props ) {
    const [userID, setUserID] = useState(props.userID);
    const [forumID, setForumID] = useState(props.forumID);

    const processForm = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (formData.get("remove-member") == "1") {
            fetch(`http://localhost:5000/remove-user-from-forum`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: userID, ForumID: forumID})
            }).then(response => {
                window.location.reload();
            }).catch(error => console.error(error));
            
        } else if (formData.get("user-forum-name-role") != props.userRole) {
            console.log("change role")
        }
    }

    return (
        <>
            <div className="form-list-element">
                <form onSubmit={ processForm } className="admin-user-form" action="" >
                    <div className="user-form-section">
                        <p>Username: {props.username}</p>
                    </div>
                    <div className="user-form-section">
                        <label htmlFor="user-forum-name-role">Role:</label>
                        <select id="user-forum-name-role" name="user-forum-name-role">
                            <option value="Member">Member</option>
                            <option value="Admin" defaultValue={props.UserRole == "Admin"}>Admin</option>
                        </select>
                    </div>
                    <div className="user-form-section">
                        <label htmlFor="remove-member">Remove Member</label>
                        <input type="checkbox" id="remove-member" name="remove-member" value="1"/>
                    </div>
                    <button className="submit-form-button" type="submit"> Submit </button>
                </form>
            </div>
        </>
    )
}

export default FormRow