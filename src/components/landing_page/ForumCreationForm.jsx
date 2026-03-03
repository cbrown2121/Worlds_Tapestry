import { useState } from "react"
import "./ForumCreationForm.css"

function ForumCreationForm() {
    const sampleUserID = 1;

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formObject = { OwnerID: sampleUserID, ForumName: formData.get("ForumName"), SearchVisibility: formData.get("SearchVisibility"), JoinPermissions: formData.get("JoinPermissions"), AllowMaps: formData.get("AllowMaps"), Tags: "#"};
        
        try { // submit to forum table
            const response = await fetch("http://localhost:5000/forums", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            // console.log(`Data was submitted successfully: ${forumData}`);

            fetch(`http://localhost:5000/add-user-to-forum`, { // set the creator to be the owner. this could be done automatically with sql triggers but i was running into issues
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: sampleUserID, ForumID: result.id, UserRole: "Owner"})
            }).then(response => response.json()).catch(error => console.error(error));


        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        window.location.reload(); // reload window to show that forum has been populated
    }

    return (
        <>
            <div id="forum-creation">
                <h1 id="forum-creation-title">Create A Forum</h1>
                <form onSubmit={handleSubmit} action="" id="forum-form">
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Name</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="ForumName" name="ForumName"/>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Visibility</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label htmlFor="SearchVisibility">Searchable</label>
                            <input type="radio" id="SearchVisibility" name="SearchVisibility" value="Searchable" defaultChecked />
                            <label htmlFor="forumSearchSettings">Hidden</label>
                            <input type="radio" id="SearchVisibility" name="SearchVisibility" value="Hidden" />
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Join Settings</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label htmlFor="JoinPermissions">Anyone</label>
                            <input type="radio" id="JoinPermissions" name="JoinPermissions" value="Anyone" defaultChecked />
                            <label htmlFor="inviteOnly">Invite Only</label>
                            <input type="radio" id="JoinPermissions" name="JoinPermissions" value="Invite Only"/>
                        </div>
                        
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Allow Maps</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label htmlFor="AllowMaps">Yes</label>
                            <input type="radio" id="AllowMaps" name="AllowMaps" value="1" />
                            <label htmlFor="inviteOnly">No</label>
                            <input type="radio" id="AllowMaps" name="AllowMaps" value="0" defaultChecked/>
                        </div>
                        
                    </div>
                    <button className="create-forum-button" type="submit">Create Forum</button>
                </form>
                
            </div>
        </>
    )
}

export default ForumCreationForm