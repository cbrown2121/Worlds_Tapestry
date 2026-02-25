import { useState } from "react"
import "./ForumCreationForm.css"

function ProfileUpdateForm(props) {

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const userId = props.userID; // demo user

        let userData = { UserName: formData.get("UserName"), Email: formData.get("Email"), Role: formData.get("Role")}
        
        try {
            const response = await fetch(`http://localhost:5000/users/${userId}`, {
                method: "PATCH",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            console.log(`Data was submitted successfully: ${userData}`);

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        window.location.reload(); // reload window to show that profile has been updated.
    }

    return (
        <>
            <div id="profile-update">
                <h1 id="profile-update-title">Update Data</h1>
                <form onSubmit={handleSubmit} action="" id="userupdate-form">
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="form-section-header">User Name</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="UserName" name="UserName"/>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="form-section-header">Email</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="Email" name="Email"/>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="form-section-header">Role</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="Role" name="Role"/>
                        </div>
                    </div>
                    <button className="profile-update-button" type="submit">Update Profile</button>
                </form>
                
            </div>
        </>
    )
}

export default ProfileUpdateForm