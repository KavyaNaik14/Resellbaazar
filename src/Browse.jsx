import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaHeart } from "react-icons/fa";

function Browse() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(
    JSON.parse(localStorage.getItem("wishlist")) || []
  );
  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    axios.get("http://localhost:9000/getItems")
      .then(res => setItems(res.data))
      .catch(err => console.log(err));
  }, []);


  function deleteItem(id) {
    const user = JSON.parse(localStorage.getItem("user"));

    axios.delete(`http://localhost:9000/deleteItem/${id}`, {
      headers: {
        userId: user._id
      }
    })
      .then(() => {
        setItems(prev => prev.filter(item => item._id !== id));
      })
      .catch(err => console.log(err));
  }




  function toggleWishlist(item) {
    let updated = [...wishlist];

    const exists = updated.find(i => i._id === item._id);

    if (exists) {
      updated = updated.filter(i => i._id !== item._id);
    } else {
      updated.push(item);
    }

    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  }






  return (
    <div className="browsePage">
      <h1>Browse Items</h1>
      <div className="searchContainer">
        <FaSearch className="searchIcon" />
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="searchBar"
        />
      </div>

      <div className="cardContainer">
        {items
          .filter(item =>
            item.itemname.toLowerCase().includes(search.toLowerCase())
          )
          .map(item => {

            const isWishlisted = wishlist.some(i => i._id === item._id);

            return (

              <div className="card" key={item._id}>

                <div
                  className="wishlistIcon"
                  onClick={() => toggleWishlist(item)}
                >
                  <FaHeart
                    size={20}
                    color={isWishlisted ? "red" : "gray"}
                  />
                </div>

                <img
                  src={`http://localhost:9000/${item.image}`}
                  alt={item.itemname}
                  className="cardImage"
                />

                <div className="cardBody">

                  {/* 🔹 Top content */}
                  <div className="cardContent">
                    <h3>{item.itemname}</h3>
                    <p>{item.description}</p>
                    <h4>₹{item.price}</h4>
                    <p>{item.location}</p>
                  </div>

                  {/* 🔹 Bottom buttons */}
                  <div className="cardActions">
                    <button
                      onClick={() => navigate(`/product/${item._id}`, { state: item })}
                    >
                      View Details
                    </button>

                    {user && user._id === item.sellerId && (
                      <button
                        onClick={() => deleteItem(item._id)}
                        style={{ background: "red", color: "white" }}
                      >
                        Delete
                      </button>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Browse;