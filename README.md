# Online Items Buy and Sell System

## Overview

The Online Items Buy and Sell System is a full-stack web application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The platform provides a secure and user-friendly marketplace where users can buy and sell second-hand products online.

Users can register, log in, upload product listings, browse available items, add products to their wishlist or cart, communicate with sellers, and place orders. The system aims to simplify online transactions while providing an efficient and responsive user experience.

---

## Features

### User Authentication

* User Registration
* Secure Login and Logout
* Session Management

### Product Management

* Add New Products
* Upload Product Images
* Edit and Delete Product Listings
* View Product Details

### Marketplace Features

* Browse Available Products
* Search Products by Name
* Category-Based Filtering
* Product Details Page

### Wishlist

* Add Products to Wishlist
* Remove Products from Wishlist
* Persistent Storage using Local Storage

### Shopping Cart

* Add Products to Cart
* Remove Products from Cart
* View Cart Summary

### Communication

* Buyer-Seller Chat System
* Seller Contact Information
* Phone Number Display

### Order Management

* Place Orders
* View Order History
* Order Notifications

### User Experience

* Responsive Design
* Interactive UI Components
* Real-Time Updates

---

## Technology Stack

### Frontend

* React.js
* JavaScript (ES6+)
* HTML5
* CSS3
* Axios
* React Router DOM
* React Icons
* Framer Motion

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Additional Tools

* JWT Authentication
* Multer (Image Upload)
* Local Storage

---

## System Architecture

1. Users register and log in to the system.
2. Sellers upload products with images and descriptions.
3. Buyers browse products and view detailed information.
4. Users can save products to their wishlist.
5. Products can be added to the shopping cart.
6. Buyers can communicate directly with sellers.
7. Orders are placed and stored in the database.
8. Notifications are generated for sellers and buyers.

---

## Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/online-items-buy-sell-system.git
cd online-items-buy-sell-system
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### MongoDB Setup

Update the MongoDB connection string in your backend configuration file:

```javascript
mongoose.connect("your_mongodb_connection_string");
```

---

## Project Structure

```text
Online-Items-Buy-Sell-System/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── uploads/
│   └── server.js
│
└── README.md
```

---

## Future Enhancements

* Online Payment Gateway Integration
* Product Recommendation System
* Product Rating and Reviews
* Email Notifications
* Admin Dashboard
* Real-Time Notifications
* Mobile Application Support

---

## Learning Outcomes

Through this project, the following concepts were implemented and explored:

* Full-Stack Web Development
* REST API Development
* MongoDB Database Management
* User Authentication and Authorization
* Image Upload and File Handling
* State Management in React
* Real-Time Communication Features
* Responsive Web Design

---

## Author

**Kavya J Naik**

