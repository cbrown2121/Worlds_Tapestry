import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import FormRow from "./FormRow";

const MemberListForm = (props) => {
    // const [userID] = useState(props.userID);
    const [forumID] = useState(props.forumID);
    const [userRole] = useState(props.userRole);
    const [forumMembers, setForumMembers] = useState([]);

    const getForumMembers = () => {
        fetch(`http://localhost:5000/${forumID}/users`)
        .then(response => response.json())
        .then(memberList => {
            setForumMembers(memberList);
        }).catch(error => console.error(error));
    }

    useEffect(() => {
        getForumMembers();
    }, []);

    const processFormData = (formData) => {
        let processedData = {};

        formData.forEach((value, key) => {
            const userID = key.split('-')[0]; // from how the object is set up everything before the first hyphen will be the user id
            const valueToChangeTo = value;

            const type = key.split('-')[2]; // will either be role or remove

            if (userID in processedData) {
                if (processedData[userID].type == "role") { // delete takes precedence over a role change
                    processedData[userID] = {type: type, value: valueToChangeTo};
                }
            } else {
                processedData[userID] = {type: type, value: valueToChangeTo};
            }
        });

        return processedData;
    }

    const sendData = (userID, value, type) => {
        if (type == "remove") {
            fetch(`http://localhost:5000/remove-user-from-forum`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: userID, ForumID: forumID})
            }).then(response => {
                window.location.reload();
            }).catch(error => console.error(error));
        } else if (type == "role") {
            fetch(`http://localhost:5000/memberlist-change-role`, {
                method: "PUT",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify({UserID: userID, ForumID: forumID, UserRole: value})
            }).then(response => {
                window.location.reload();
            }).catch(error => console.error(error));
        }
    }

    const processForm = async (event) => {
        event.preventDefault();

        const processedFormData = processFormData(new FormData(event.currentTarget));

        for (let key in processedFormData) {
            sendData(key, processedFormData[key].value, processedFormData[key].type);
        }
    }

    return (
        <>
            <div className="user-forms">
                <form onSubmit={ processForm } action="">
                    {forumMembers.map((member) => {
                        return <FormRow key={member.UserID} forumMember={member} adminUserRole={userRole} ForumID={forumID}/>
                    })}
                    <button id="forum-member-edit-submit">Submit</button>
                </form>

            </div>
        </>
    )
}

export default MemberListForm;