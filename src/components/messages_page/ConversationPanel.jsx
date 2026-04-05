import { useContext, useEffect, useState } from "react";
import "./MessagesPage.css";
import { UserContext } from "../../contexts/Context";

const ConversationPanel = ({userPageID}) => {
  const { user, loggedIn } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadConversation = () => {
    fetch(`http://localhost:5000/messages/conversation/${user.UserID}-${userPageID}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadConversation();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("http://localhost:5000/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        SenderID: user.UserID,
        ReceiverID: userPageID,
        MessageText: text,
      }),
    });

    setText("");
    loadConversation();
  };

  return (
    <div className="messages-section">
      <h2>Direct Messages</h2>

      <div className="messages">
        {messages.map((m) => (
          <div key={m.MessageID} style={{ marginBottom: 8 }}>
            <strong>{m.SenderID === user.UserID ? "You" : `${m.UserName}`}:</strong>{" "}
            {m.MessageText}
          </div>
        ))}
      </div>

      <div className="send-new-massage">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ width: 420, padding: 8 }}
        />
        <button onClick={sendMessage}>
          Send
        </button>
      </div>

    </div>
  );
}

export default ConversationPanel;