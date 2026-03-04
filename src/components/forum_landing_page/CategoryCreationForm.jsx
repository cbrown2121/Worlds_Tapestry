function CategoryCreationForum( props ) {

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const formObject = { CategoryName: formData.get("CategoryName"), CategoryDescription: formData.get("CategoryDescription"), Pinned: formData.get("PinStatus"), ForumID: props.forumID};

        try { // submit to category table
            const response = await fetch("http://localhost:5000/category", {
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

        } catch (error) {
            console.log(`Data was submitted unsuccessfully: ${error}`);
        }

        window.location.reload(); // reload window to show that forum has been populated
    }

    return (
        <> { /* ill update later so the classnames dont match the forum landing page */ }
            <div id="forum-creation">
                <h1 id="forum-creation-title">Add New Category</h1>
                <form onSubmit={handleSubmit}  action="" id="forum-form"> 
                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Category Name</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="CategoryName" name="CategoryName"/>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Category Description</h2>
                        </div>
                        <div className="section-options">
                            <input type="text" id="CategoryDescription" name="CategoryDescription"/>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-heading">
                            <h2 className="forum-section-header">Pin Status</h2>
                        </div>

                        <div className="forum-radio-button">
                            <label htmlFor="PinStatus">Pinned</label>
                            <input type="radio" id="PinStatus" name="PinStatus" value="1"/>
                            <label htmlFor="forumSearchSettings">Not Pinned</label>
                            <input type="radio" id="PinStatus" name="PinStatus" value="0" defaultChecked/>
                        </div>
                    </div>
                    <button className="create-forum-button" type="submit">Create Category</button>
                </form>
                
            </div>
        </>
    )
}

export default CategoryCreationForum