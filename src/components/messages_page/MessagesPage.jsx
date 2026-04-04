import { useContext, useEffect, useState } from "react";
import "./MessagesPage.css";
import { UserContext } from "../../contexts/Context";
import { universalDatabaseFetch } from "../../utility";
import ConverstationTab from "./ConverstationTab";
import ConversationPanel from "./ConversationPanel";

const MessagesPage = () => {
  const { user, loggedIn } = useContext(UserContext);
  const [converstationList, setConverstationList] = useState([]);
  const [focusedConverstation, setFocusConverstation] = useState(null);

  const loadConversations = () => {
    universalDatabaseFetch(`messages/${user.UserID}`).then((data) => {
      setConverstationList(data);

      if (1 < converstationList.length) {
        let mostRecent = converstationList[0];
        let mostRecentUserID = (mostRecent.ReceiverID == user.UserID) ? mostRecent.SenderID : mostRecent.ReceiverID;
        setFocusConverstation(mostRecentUserID);
      }
    });
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="all-user-messages main-content">
      <div className="user-converstation-list">
          {converstationList.map((converstation) => (
            <ConverstationTab key={converstation.MessageID} {...converstation} goToConverstation={setFocusConverstation}/>
          ))}
      </div>
      <div className="focused-converstation">
        <ConversationPanel key={focusedConverstation} otherUserID={focusedConverstation}/>
      </div>
    </div>
  );
}

export default MessagesPage;