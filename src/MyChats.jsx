import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyChats() {
  const [chats, setChats] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:9000/myChats/${user._id}`)
      .then(res => setChats(res.data))
      .catch(err => console.log(err));
  }, [user._id]);

  return (
    <div className="chatListPage">
      <h2>My Chats</h2>

      {chats.map(chat => (
        <div
          key={chat._id}
          className="chatCard"
          onClick={() => navigate(`/chat/${chat._id}`)}
        >
          {/* Avatar */}
          <div className="avatar">
            {chat.otherUserName?.charAt(0).toUpperCase()}
          </div>

          {/* Info */}
          <div className="chatInfo">
            <h4>{chat.otherUserName}</h4>
            <p className="lastMsg">
              {chat.lastMessage || "Start conversation"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyChats;