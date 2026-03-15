import { useEffect, useState } from "react";
import "./MessagesPage.css";

export default function MessagesPage(props) {
  // props: currentUserID (user viewing page) userPageID (users page)
  const [currentUserID] = useState(props.currentUserID);
  const [userPageID] = useState(props.userPageID);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadConversation = () => {
    fetch(`http://localhost:5000/messages/conversation/${currentUserID}-${userPageID}`)
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
        SenderID: currentUserID,
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
      <p>Chat: {currentUserID} ↔ {userPageID}</p>

      <div className="messages">
        {messages.map((m) => (
          <div key={m.MessageID} style={{ marginBottom: 8 }}>
            <strong>{m.SenderID === currentUserID ? "You" : `User ${m.SenderID}`}:</strong>{" "}
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

