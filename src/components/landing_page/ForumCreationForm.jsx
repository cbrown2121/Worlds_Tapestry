import "./ForumCreationForm.css"

function ForumCreationForm() {

    const handleSubmit = async (event) => {
        event.preventDefault();

        let id = Date.now() + Math.random();
        id = id.toString();

        const formData = new FormData(event.currentTarget);

        let forumData = { forum_id: id.substring(0, 6), forum_name: formData.get("ForumName"), creation_date: 2026, member_count: 0, settings_id: id.substring(0, 8), tags: "#"}
        // let settingsData = { SettingsID: id.substring(0, 8), SearchVisiblity: "Viewable", JoinPermissions: "Anyone", UIType: null}

        try { // submit to forum table
            const response = await fetch("http://localhost:5000/forums", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(forumData),
            });

            if (!response.ok) {
                throw new Error("Network response error");
            }

            const result = await response.json();
            console.log(`Data was submitted successfully: ${result}`);

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        // try { // submit to forum settings table
        //     const response = await fetch("http://localhost:5000/forumsettings", {
        //         method: "POST",
        //         headers: {
        //         "Content-Type": "application/json"
        //         },
        //         body: JSON.stringify(settingsData),
        //     });

        //     if (!response.ok) {
        //         throw new Error("Network response error");
        //     }

        //     const result = await response.json();
        //     console.log(`Data was submitted successfully: ${result}`);

        // } catch (error) {
        //     console.log(`Data was submitted unsuccessfully: ${error}`);
        // }
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

                    {/* <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Visibility</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label htmlFor="searchable">Searchable</label>
                            <input type="radio" id="searchable" name="searchable" value="searchable" defaultChecked />
                            <label htmlFor="forumSearchSettings">Hidden</label>
                            <input type="radio" id="searchable" name="searchable" value="hidden" />
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Join Settings</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label htmlFor="joinPermissions">Anyone</label>
                            <input type="radio" id="joinPermissions" name="joinPermissions" value="anyone" defaultChecked />
                            <label htmlFor="inviteOnly">Invite Only</label>
                            <input type="radio" id="joinPermissions" name="joinPermissions" value="inviteOnly"/>
                        </div>
                        
                    </div> */}
                    <button className="create-forum-button" type="submit">Create Forum</button>
                </form>
                
            </div>
        </>
    )
}

export default ForumCreationForm