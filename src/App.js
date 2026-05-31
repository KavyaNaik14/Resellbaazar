import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home.jsx'
import Browse from './Browse.jsx';
import Categories from './Categories.jsx';
import ContactUs from './ContactUs.jsx';
import Sellitem from './Sellitem.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Profile from './Profile.jsx';
import Wishlist from './Wishlist.jsx';
import Cart from './Cart.jsx';
import Viewproduct from './Viewproduct.jsx';
import MyOrders from './MyOrders.jsx';
import ChatPage from './ChatPage.jsx';
import MyChats from './MyChats.jsx';
import ProtectedRoute from './ProtectedRoute';



function App() {
  return (
    <div>
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about-us" element={<AboutUs/>} /> */}
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path='/Browse' element={<Browse />} />
        <Route path='/Sell-Item' element={<Sellitem />} />
        <Route path='/Categories' element={<Categories />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Profile' element={<Profile />} />
        <Route path='/Wishlist' element={<Wishlist />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/product/:id' element={<Viewproduct />} />
        <Route path='/MyOrders' element={<MyOrders />} />
        <Route path="/chats" element={<MyChats />} />
        <Route path="/chat/:chatId" element={<ChatPage />} />
        <Route
          path="/Browse"
          element={
            <ProtectedRoute>
              <Browse />
            </ProtectedRoute>
          }
        />


      </Routes>
    </div>
  )
}

export default App
