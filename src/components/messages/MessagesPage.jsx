import { useEffect, useState } from "react";

export default function MessagesPage() {
  const user1 = 13;   // you (demo)
  const user2 = 231;  // other user (demo)

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const loadConversation = () => {
    fetch(`http://localhost:5050/api/messages/conversation?user1=${user1}&user2=${user2}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    loadConversation();
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await fetch("http://localhost:5050/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        SenderID: user1,
        ReceiverID: user2,
        MessageText: text,
      }),
    });

    setText("");
    loadConversation();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Direct Messages</h2>
      <p>Chat: {user1} ↔ {user2}</p>

      <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8, maxWidth: 600 }}>
        {messages.map((m) => (
          <div key={m.MessageID} style={{ marginBottom: 8 }}>
            <strong>{m.SenderID === user1 ? "You" : `User ${m.SenderID}`}:</strong>{" "}
            {m.MessageText}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          style={{ width: 420, padding: 8 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 8, padding: "8px 12px" }}>
          Send
        </button>
      </div>
    </div>
  );
}

