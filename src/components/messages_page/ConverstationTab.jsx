import { useContext, useEffect, useState } from "react";
import "./MessagesPage.css";
import { UserContext } from "../../contexts/Context";

const ConverstationTab = ({MessageText, SenderID, Receiver, ReceiverProfile, ReceiverID, Sender, SenderProfile, goToConverstation}) => {
  const imageBaseURL = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDNAME}/image/upload/`;
  
  const { user, loggedIn } = useContext(UserContext);
  const [friendID, setFriendID] = useState();
  const [friendUserName, setFriendUserName] = useState();
  const [friendProfile, setFriendProfile] = useState();
  const [lastMessage] = useState(MessageText);

  useEffect(() => {
    if (user.UserID == SenderID) {
      setFriendID(ReceiverID);
      setFriendUserName(Receiver);
      setFriendProfile(ReceiverProfile);
    } else {
      setFriendID(SenderID);
      setFriendUserName(Sender);
      setFriendProfile(SenderProfile);
    }
  }, []);

  return (
    <button className="converstation-tab-interact-case" onClick={() => goToConverstation(friendID)} >
      <div className="converstation-tab">
        <img src={`${imageBaseURL}${friendProfile}`} alt={ `${friendUserName} profile image` } />
        { friendUserName }
      </div>
    </button>
  );
}

export default ConverstationTab;