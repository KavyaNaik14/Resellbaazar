import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [ordered, setOrdered] = useState(false);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const total = cart.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);

  function removeItem(id) {
    const updated = cart.filter(i => i._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  }

  // MAIN FIX: Send order to backend
  function placeOrder() {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    axios.post("http://localhost:9000/placeOrder", {
      items: cart,
      total: total
    })
      .then(res => {


        setOrdered(true);
        localStorage.removeItem("cart");
        setCart([]);
      })
      .catch(err => {
        console.log(err);
        alert("Error placing order");
      });
  }





  if (ordered) {
    return (
      <div className="orderWrapper">
        <div className="orderCard">
          <div className="successIcon">✅</div>

          <h2>Order Placed!</h2>
          <p>Your order has been saved successfully.</p>

          <button onClick={() => navigate('/Browse')}>
            Continue Browsing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="browsePage">
      <h1>My Cart</h1>

      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cardContainer">
            {cart.map(item => (
              <div className="card" key={item._id}>
                <img
                  src={`http://localhost:9000/${item.image}`}
                  alt={item.itemname}
                  className="cartImage"
                />

                <div className="cardBody">
                  <h3>{item.itemname}</h3>
                  <p>{item.location}</p>
                  <h4>₹{item.price}</h4>

                  <button onClick={() => removeItem(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>


          <div className="cartSummary">
            <h2>Order Summary</h2>

            <div className="summaryRow">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>

            <div className="summaryRow">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button className="placeOrderBtn" onClick={placeOrder}>
              🛒 Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;