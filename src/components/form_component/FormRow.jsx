import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';

const FormRow = (props) => {
    const [userName] = useState(props.forumMember.UserName);
    const [userID] = useState(props.forumMember.UserID);
    const [userRole] = useState(props.forumMember.UserRole);
    const [adminPrivilege] = useState(props.adminUserRole);
    const [forumID] = useState(props.forumID);

    console.log(props);

    const [privilegeOverUser] = useState((userRole == "Member" || adminPrivilege == "Owner"));

    return (
        <>
            <div className={`form-list-element admin-can-change-${privilegeOverUser}`}> 
                <div className="user-form-section">
                    <p>Username: {userName}</p>
                </div>
                <div className="user-form-section">
                    <label htmlFor="user-forum-name-role">Role:</label>
                    <select disabled={!privilegeOverUser || userRole == "Owner"} defaultValue={ userRole } id={`${userID}-change-role`} name={`${userID}-change-role`}>
                        <option value="Member">Member</option>
                        <option value="Admin">Admin</option>
                        { userRole == "Owner" && 
                            <option value="Owner">Owner</option>
                        }
                    </select>
                </div>
                <div className="user-form-section">
                    <label htmlFor="remove-member">Remove Member</label>
                    <input disabled={!privilegeOverUser || userRole == "Owner"} type="checkbox" id={`${userID}-user-remove`} name={`${userID}-user-remove`} value="1"/>
                </div>
            </div>
        </>
    )
}

export default FormRow;