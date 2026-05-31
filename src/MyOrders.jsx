import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function MyOrders({ setOrderCount }) {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    axios.get(`http://localhost:9000/getOrders/${user._id}`)
      .then(res => {
        console.log("ORDERS:", res.data); 
        setOrders(res.data);
        setOrderCount && setOrderCount(res.data.length);
      })
      .catch(err => console.log(err));
  }, [setOrderCount]);

  return (
    <>
      <h3 className="profileSectionTitle">My Orders</h3>

      <div className="cardContainer">
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map(order =>
            order.items.map(item => (
              <div
                className="card"
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="cardBody">

                  <span className={`conditionBadge ${item.condition === 'vintage'
                      ? 'badgeVintage'
                      : item.condition === 'new'
                        ? 'badgeNew'
                        : 'badgeUsed'
                    }`}>
                    {item.condition}
                  </span>

                  <h3 className="cardTitle">{item.itemname}</h3>
                  <p className="price">₹{item.price}</p>
                  <p className="location">{item.location}</p>

                  <img
                    src={`http://localhost:9000/${item.image}`}
                    alt={item.itemname}
                    style={{ width: '100%', marginTop: '10px', borderRadius: '6px' }}
                  />

                  <p
                    style={{
                      color:
                        order.status === "accepted"
                          ? "green"
                          : order.status === "rejected"
                            ? "red"
                            : "orange",
                      fontWeight: "bold",
                      marginTop: "5px"
                    }}
                  >
                    Status: {order.status?.toUpperCase() || "PENDING"}
                  </p>

                </div>
              </div>
            ))
          )
        )}
      </div>
    </>
  );
}

export default MyOrders;