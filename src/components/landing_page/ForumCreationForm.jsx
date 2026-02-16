import "./ForumCreationForm.css"

function ForumCreationForm() {

    const createForum = (e) => {
        e.preventDe
        console.log("create form")
    }

    return (
        <>
            <div id="forum-creation">
                <h1 id="forum-creation-title">Create A Forum</h1>
                <form action="" id="forum-form">
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Name</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="forumName" name="forumName"/>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Visibility</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label for="visible">Searchable</label>
                            <input type="radio" id="searchable" name="visible" value="searchable" checked />
                            <label for="forumSearchSettings">Hidden</label>
                            <input type="radio" id="hidden" name="hidden" value="hidden" />
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Forum Join Settings</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label for="public">Public</label>
                            <input type="radio" id="public" name="public" value="public" checked />
                            <label for="inviteOnly">Invite Only</label>
                            <input type="radio" id="inviteOnly" name="inviteOnly" value="inviteOnly"/>
                        </div>
                    </div>
                    <button className="create-forum-button" onClick={createForum()}>Create Forum</button>
                </form>
                
            </div>
        </>
    )
}

export default ForumCreationForm