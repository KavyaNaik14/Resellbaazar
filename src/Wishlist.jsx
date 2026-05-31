import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Wishlist() {
  const navigate = useNavigate();

  const [wishlist, setWishlist] = useState([]);

  // ✅ LOAD FROM LOCAL STORAGE
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);

  // ✅ REMOVE ITEM
  function removeItem(id) {
    const updated = wishlist.filter(item => item._id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }

  return (
    <div className="browsePage">
      <h1 className="browseTitle">My Wishlist ❤️</h1>
      <p className="results">
        {wishlist.length} saved item{wishlist.length !== 1 ? "s" : ""}
      </p>

      {wishlist.length === 0 ? (
        <div className="emptyState">
          <p style={{ fontSize: "50px" }}>💔</p>
          <p>Your wishlist is empty.</p>
          <button
            className="loginBtn"
            style={{ marginTop: "16px" }}
            onClick={() => navigate("/Browse")}
          >
            Browse Items
          </button>
        </div>
      ) : (
        <div className="cardContainer">
          {wishlist.map(item => (
            <div className="card" key={item._id}>

              {/* IMAGE */}
              <img
                src={`http://localhost:9000/${item.image}`}
                alt={item.itemname}
                className="cardImage"
              />

              <div className="cardBody">
                <h3>{item.itemname}</h3>
                <p>{item.description}</p>
                <h4>₹{item.price}</h4>
                <p>📍 {item.location}</p>

                <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>

                  {/* VIEW PRODUCT */}
                  <button
                    onClick={() => navigate(`/product/${item._id}`)}
                    style={{ flex: 1 }}
                  >
                    View
                  </button>

                  {/* REMOVE */}
                  <button
                    onClick={() => removeItem(item._id)}
                    style={{
                      background: "#fee2e2",
                      color: "#991b1b",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      padding: "8px"
                    }}
                  >
                    🗑
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;