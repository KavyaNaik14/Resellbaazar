import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyOrders from "./MyOrders";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";


function Profile() {
  const [editing, setEditing] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [, setOrders] = useState([]);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    location: '',
    phone: ''
  });
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null);

  // ✅ 1. LOAD ON PAGE OPEN
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.profilePic) {
      setProfilePic(`http://localhost:9000/${user.profilePic}`);
    }
  }, []);

  // ✅ 2. LISTEN FOR UPDATES
  useEffect(() => {
    const handleStorageChange = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.profilePic) {
        setProfilePic(`http://localhost:9000/${user.profilePic}`);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        "http://localhost:9000/uploadProfilePic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            userid: user._id
          }
        }
      );

      const imagePath = res.data.profilePic;

      // ✅ update UI
      setProfilePic(`http://localhost:9000/${imagePath}`);

      // ✅ FIX: keep old user data
      const updatedUser = {
        ...user,
        profilePic: imagePath
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      // 🔥 ADD THIS LINE (this refreshes Navbar instantly)
      window.dispatchEvent(new Event("storage"));

    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const socket = io("http://localhost:9000");

    socket.emit("join", String(user._id));

    socket.on("orderUpdate", (updatedOrder) => {
      alert(`Your order was ${updatedOrder.status}`);


      setOrders(prev =>
        prev.map(o =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );
    });

    return () => socket.disconnect();
  }, []);





  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location || "Unknown"
      }));
    }
  }, []);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    // load old notifications
    axios.get(`http://localhost:9000/sellerNotifications/${user._id}`)
      .then(res => setNotifications(res.data));

    // socket connect
    const socket = io("http://localhost:9000");

    socket.on("connect", () => {
      socket.emit("join", String(user._id));
    });

    socket.on("newOrder", (data) => {
      setNotifications(prev => [data.order, ...prev]);
      alert("New order received!");
    });

    return () => socket.disconnect();
  }, []);


  const [draft, setDraft] = useState(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  //  Orders state
  // const [orders, setOrders] = useState([]);

  // Fetch orders from backend
  // useEffect(() => {
  //   axios.get("http://localhost:9000/getOrders")
  //     .then(res => setOrders(res.data))
  //     .catch(err => console.log(err));
  // }, []);



  function logout() {
    localStorage.removeItem("user");
    navigate("/login", { replace: true });

  }

  function handleChange(e) {
    const { name, value } = e.target;
    setDraft(prev => ({ ...prev, [name]: value }));
  }

  // ACCEPT ORDER
  function acceptOrder(id) {
    axios.put(`http://localhost:9000/updateOrder/${id}`, {
      status: "accepted"
    }).then(res => {
      setNotifications(prev =>
        prev.map(o => o._id === id ? res.data : o)
      );
    }).catch(err => console.log(err));
  }

  // REJECT ORDER
  function rejectOrder(id) {
    axios.put(`http://localhost:9000/updateOrder/${id}`, {
      status: "rejected"
    }).then(res => {
      setNotifications(prev =>
        prev.map(o => o._id === id ? res.data : o)
      );
    }).catch(err => console.log(err));
  }


  function deleteNotification(id) {
    axios.delete(`http://localhost:9000/deleteOrder/${id}`)
      .then(() => {
        // remove from UI instantly
        setNotifications(prev => prev.filter(o => o._id !== id));
      })
      .catch(err => console.log(err));
  }

  function handleBuy(item) {
    const user = JSON.parse(localStorage.getItem("user"));

    axios.post("http://localhost:9000/buy", {
      buyerName: user.name,
      buyerEmail: user.email,
      sellerEmail: item.email,
      itemId: item._id,
      itemName: item.itemname
    })
      .then(() => {
        alert("Order placed successfully!");
      })
      .catch(err => console.log(err));
  }

  function handleSave(e) {
    e.preventDefault();
    setProfile({ ...draft });
    setEditing(false);
  }

  const initials = profile.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="profilePage">

      {/* Header */}
      <div className="profileHeader">
        <div className="profileAvatarWrapper">
          <div className="profileAvatar">
            {profilePic ? (
              <img src={profilePic} alt="profile" />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          {/* 🔥 Hidden file input */}
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          {/* ✏️ Edit icon */}
          <label htmlFor="profileUpload" className="editIcon">
            ✏️
          </label>
        </div>

        <div>
          <h2 className="profileName">{profile.name}</h2>
          <p className="profileMeta">
            📍 {profile.location} · Member since 2024 · ⭐ 4.8 rating
          </p>
        </div>

        <button
          className="editProfileBtn"
          onClick={() => {
            setDraft({ ...profile });
            setEditing(!editing);
          }}
        >
          {editing ? 'Cancel' : ' Edit Profile'}
        </button>

      
      </div>

      {/* Edit Form */}
      {editing && (
        <form className="profileForm" onSubmit={handleSave}>



          <div className="formRow">
            <div className="formGroup">
              <label>Name</label>
              <input name="name" value={draft.name} onChange={handleChange} />
            </div>
            <div className="formGroup">
              <label>Location</label>
              <input name="location" value={draft.location} onChange={handleChange} />
            </div>
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label>Email</label>
              <input name="email" type="email" value={draft.email} onChange={handleChange} />
            </div>
            
          </div>

          <button type="submit" className="loginBtn">
            Save Changes
          </button>
        </form>
      )}

      {/* Stats (optional static) */}
      <div className="profileStats">
        <div className="profileStat">
          <span className="statVal">{orderCount}</span>
          <span className="statLbl">Orders</span>
        </div>
        <div className="profileStat">
          <span className="statVal">4.8★</span>
          <span className="statLbl">Rating</span>
        </div>
      </div>

      <h3 className="profileSectionTitle">Notifications</h3>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map(order => {
          const item = order.items?.[0];

          return (
            <div key={order._id} className="notificationCard">

              {/* IMAGE */}
              <img
                src={`http://localhost:9000/${item?.image}`}
                className="notificationImg"
                alt="Profile"
              />

              {/* CONTENT */}
              <div>
                <p>
                  <b>{order.buyerName}</b> wants to buy your product
                </p>

                <h4>{item?.itemname}</h4>
                <p>{order.buyerEmail}</p>
                <p>₹{item?.price}</p>
              </div>

              {/* ACTIONS */}
              <div>
                {order.status === "pending" || !order.status ? (
                  <>
                    <button
                      className="acceptBtn"
                      onClick={() => acceptOrder(order._id)}
                    >
                      Accept
                    </button>

                    <button
                      className="rejectBtn"
                      onClick={() => rejectOrder(order._id)}
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      style={{
                        color: order.status === "accepted" ? "green" : "red",
                        fontWeight: "bold",
                        marginBottom: "5px"
                      }}
                    >
                      {order.status.toUpperCase()}
                    </span>

                    {/* 🗑️ DELETE ONLY AFTER ACTION */}
                    <button
                      className="deleteBtn"
                      onClick={() => deleteNotification(order._id)}
                    >
                      🗑 Delete
                    </button>
                  </>

                )}

              </div>

            </div>
          );
        })
      )}
      <MyOrders setOrderCount={setOrderCount} />

      {/* ✅ MY ORDERS */}


    </div>
  );
}

export default Profile;