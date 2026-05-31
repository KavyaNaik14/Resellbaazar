import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

function Product() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [message, setMessage] = useState("");   // ✅ string
  const [messages, setMessages] = useState([]); // ✅ array
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [showPhone, setShowPhone] = useState(false);



  const user = JSON.parse(localStorage.getItem("user"));

  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );

  useEffect(() => {
    axios.get(`http://localhost:9000/getItem/${id}`)
      .then(res => setItem(res.data))
      .catch(err => console.log(err));
  }, [id]);



  function toggleWishlist(product) {
    let updated = [...wishlist];

    const exists = updated.find(i => i._id === product._id);

    if (exists) {
      updated = updated.filter(i => i._id !== product._id);
    } else {
      updated.push(product);
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }


  function addToCart(product) {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🚫 NOT LOGGED IN
    if (!user || !user._id) {
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        navigate("/login");   // redirect to login
      }, 2000);

      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(i => i._id === product._id);

    if (existing) {
      // increase quantity
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({
        _id: product._id,
        itemname: product.itemname,
        price: product.price,
        image: product.image,
        location: product.location,
        condition: product.condition,
        contact: product.contact,
        qty: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    // alert("Added to cart");
    navigate("/cart");
  }


  function handleBuy(item) {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return;
    }

    axios.post("http://localhost:9000/placeOrder", {
      buyerId: user._id,
      buyerEmail: user.email,
      buyerName: user.name,  // ✅ REQUIRED

      items: [
        {
          _id: item._id,
          itemname: item.itemname,
          price: item.price,
          image: item.image,
          location: item.location,
          condition: item.condition,
          contact: item.contact,
          sellerId: item.sellerId   // ✅ FIXED
        }
      ],

      total: item.price   // ✅ FIXED
    })
      .then(() => {
        window.location.href = "/MyOrders"; // redirect
      })
      .catch(err => console.log(err));
  }

  const [showAlert, setShowAlert] = useState(false);
  function startChat() {
    if (!user) {
      setShowAlert(true);

      // auto hide after 3 sec
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      return;
    }

    axios.post("http://localhost:9000/startChat", {
      buyerId: user._id,
      sellerId: item.sellerId,
      itemId: item._id
    })
      .then(res => {

        // 🔥 SEND PRODUCT AS FIRST MESSAGE
        // axios.post("http://localhost:9000/sendMessage", {
        //   chatId: res.data._id,
        //   senderId: user._id,
        //   text: "Interested in this product",
        //   type: "product",
        //   product: {
        //     name: item.itemname,
        //     price: item.price,
        //     image: item.image
        //   }
        // });

        navigate(`/chat/${res.data._id}`);

        window.location.href = `/chat/${res.data._id}`;
      })
      .catch(err => console.log(err));
  }

  function loadMessages(id) {
    axios.get(`http://localhost:9000/getMessages/${id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.log(err));
  }

  function showNumber() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user._id) {
      setShowAlert(true);

      setTimeout(() => {
        setShowAlert(false);
        navigate("/login");
      }, 2000);

      return;
    }

    axios.get(`http://localhost:9000/sellerPhone/${item.sellerId}/${user._id}`)
      .then(res => {
        if (!res.data.phone) {
          setPhone("Not available");
        } else {
          setPhone(res.data.phone);
        }
        setShowPhone(true);   // 🔥 show UI
      })
      .catch(err => {
        setPhone("Access denied");
        setShowPhone(true);
      });
  }

  function sendMessage() {
    if (!message.trim()) return;

    axios.post("http://localhost:9000/sendMessage", {
      chatId,
      senderId: user._id,
      text: message
    })
      .then(() => {
        setMessage("");
        loadMessages(chatId);   // 🔥 refresh chat
      })
      .catch(err => console.log(err));
  }


  if (!item) return <h2>Loading...</h2>;
  const isWishlisted = wishlist.some(i => i._id === item._id);
  return (


    <div className="productPage">

      {showPhone && (
        <div className="phoneModal">
          <div className="phoneCard">
            <h3>📞 Seller Contact</h3>
            <p className="phoneNumber">{phone}</p>

            <button onClick={() => setShowPhone(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showAlert && (
        <div className="customAlert">
          ⚠️ Please login first
        </div>
      )}
      <img src={`http://localhost:9000/${item.image}`}  alt={item.title}/>

      <h2>{item.itemname}</h2>
      <p>{item.description}</p>
      <h3>
        ₹{item.price}
        <FaHeart
          size={15}
          style={{ marginLeft: "10px", cursor: "pointer" }}
          color={wishlist.some(i => i._id === item._id) ? "red" : "gray"}
          onClick={() => toggleWishlist(item)}
        />
      </h3>

      <p>📍 {item.location}</p>

      {/* 🔥 SELLER BOX */}
      {/* 🔥 SELLER CARD (OLX STYLE) */}
      <div className="sellerCard">

        <div className="sellerTop">
          <div className="sellerAvatar">
            {item.sellerName?.charAt(0).toUpperCase()}
          </div>

          <div className="sellerDetails">
            <h4>{item.sellerName}</h4>
            <p className="memberSince">Member</p>
          </div>
        </div>



        <button className="chatBtn" onClick={startChat}>
          Chat with Seller 💬
        </button>

        {user ? (
          <button className="phoneBtn" onClick={showNumber}>
            📞 Show Number
          </button>
        ) : (
          <button
            className="phoneBtn"
            onClick={() => navigate("/login")}
          >
            🔒 Login to view number
          </button>
        )}

        {chatId && (
          <div style={{ marginTop: "10px" }}>

            <div style={{ maxHeight: "200px", overflowY: "auto" }}>
              {messages.map((m, i) => (
                <p key={i}>
                  <b>{m.senderId === user._id ? "You" : "Seller"}:</b> {m.text}
                </p>
              ))}
            </div>

            <input
              type="text"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button className="chatBtn" onClick={sendMessage}>
              Send
            </button>

          </div>
        )}

      </div>

      <button
        onClick={() => addToCart(item)}
        style={{
          opacity: user ? 1 : 0.6,
          cursor: user ? "pointer" : "not-allowed"
        }}
      >
        {user ? "Add to Cart 🛒" : "🔒 Login to add"}
      </button>

      {/* 🔥 BUY NOW */}
      <button onClick={() => handleBuy(item)}>
        Buy Now
      </button>

    </div>


  );
}

export default Product;