import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

function ChatPage() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [otherUser, setOtherUser] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const bottomRef = useRef();

  //  SOCKET
  useEffect(() => {
    const socket = io("http://localhost:9000");

    socket.emit("join", String(user._id));

    socket.on("newMessage", (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.disconnect();
  }, [user._id]);

  //  LOAD MESSAGES
  // useEffect(() => {
  //   loadMessages();
  //   loadChatInfo();
  // }, [chatId]);

  useEffect(() => {
  loadChatInfo();
  loadMessages();
}, [loadChatInfo, loadMessages]);

  function loadMessages() {
    axios.get(`http://localhost:9000/getMessages/${chatId}`)
      .then(res => setMessages(res.data));
  }

  //  GET OTHER USER NAME
  function loadChatInfo() {
    axios.get(`http://localhost:9000/myChats/${user._id}`)
      .then(res => {
        const chat = res.data.find(c => c._id === chatId);
        setOtherUser(chat?.otherUserName || "User");
      });
  }

  //  SEND
  function sendMessage() {
    if (!message.trim()) return;

    axios.post("http://localhost:9000/sendMessage", {
      chatId,
      senderId: user._id,
      text: message
    }).then(() => {
      setMessage("");
    });
  }

  //  AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chatContainer">

      {/* HEADER */}
      <div className="chatHeader">
        <div className="avatar">
          {otherUser?.charAt(0).toUpperCase()}
        </div>
        <h3>{otherUser}</h3>
      </div>

      {/* MESSAGES */}
      <div className="chatMessages">
        {messages.map((m, i) => (
          <div key={i} className={m.senderId === user._id ? "messageRow you" : "messageRow other"}>

            {/* PRODUCT MESSAGE */}
            {m.type === "product" && m.product && (
              <div className="bubble">
                <img
                  src={`http://localhost:9000/${m.product.image}` }
                  style={{ width: "100px", borderRadius: "10px" }}
                  alt="Chat"
                />
                <p>{m.product.name}</p>
                <p>₹{m.product.price}</p>
              </div>
            )}

            {/* NORMAL TEXT */}
            {m.type !== "product" && (
              <div className="bubble">
                {m.text}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="chatInput">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}

export default ChatPage;