import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./App.css";

function Navbar() {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    };

    loadUser();

    window.addEventListener("storage", loadUser);

    return () => window.removeEventListener("storage", loadUser);
  }, []);

  function logout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  return (
    <div className='weblogo'>
      <div className='navbarWrapper'>


        <div className="navMenu1">
          <NavLink to="/" className='navLinks'>Home</NavLink>
          <NavLink to="/Browse" className='navLinks'>Browse</NavLink>
          <NavLink to="/Categories" className='navLinks'>Categories</NavLink>
          <NavLink to="/Sell-Item" className='navLinks'>Sell Item</NavLink>
          <NavLink to="/contact-us" className='navLinks'>Contact Us</NavLink>
        </div>


        <div className="navMenu2">

          {!user ? (
            <>
              <NavLink to="/login" className='navLinks'>Login</NavLink>
              <NavLink to="/Signup" className='navLinks'>Signup</NavLink>
            </>
          ) : (
            <>
              {/* <NavLink to="/Profile" className='navLinks'>Profile</NavLink> */}
              <NavLink to="/Wishlist" className='navLinks'>Wishlist❤️</NavLink>
              <NavLink to="/Cart" className='navLinks'>Cart</NavLink>
              <NavLink to="/MyOrders" className='navLinks'>My Orders</NavLink>
              <NavLink to="/chats" className='navLinks'>Chat</NavLink>

              <NavLink to="/profile" className="userName">
                <div className="navAvatar">
                  {user?.profilePic ? (
                    <img
                      src={`http://localhost:9000/${user.profilePic}?t=${Date.now()}`}
                      alt="profile"
                      className="navAvatarImg"
                    />
                  ) : (
                    <span className="navAvatarText">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <span className="navUserName">{user.name}</span>
              </NavLink>

              <button className="logoutBtn" onClick={logout}>
                <span>Logout</span>
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Navbar;