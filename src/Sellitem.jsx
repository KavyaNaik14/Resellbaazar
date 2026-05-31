import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useRef } from "react";


const CATEGORIES = ['Electronics', 'Furniture', 'Books', 'Music', 'Clothing', 'Accessories', 'Sports', 'Car', 'Bike', 'Home Appliances', 'Other'];

function Sellitem() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [alertMsg, setAlertMsg] = useState("");


  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    condition: 'used',
    description: '',
    location: '',
    phone: '',
    UploadedFile: null,

    // SAFE
    sellerId: user?._id || "",
    sellerName: user?.name || "Unknown Seller",
    sellerPhone: user?.phone || "Not Provided"
  });

  const [errors, setErrors] = useState({});

  // Handle input
  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  const hasRun = useRef(false);
  useEffect(() => {
    if (hasRun.current) return;

    if (!user) {
      hasRun.current = true;

      setAlertMsg("Please login first to sell items");

      setTimeout(() => {
        navigate("/login");
      }, 1500); // delay so user sees alert
    }
  }, [user, navigate]);

  // Validation
  function validate() {
    const e = {};
    const phoneRegex = /^[0-9]{10}$/;   // ✅ 10 digit rule

    if (!form.name.trim()) e.name = 'Item name required';
    if (!form.price || form.price <= 0) e.price = 'Valid price required';
    if (!form.category) e.category = 'Select category';
    if (!form.description.trim()) e.description = 'Description required';
    if (!form.location.trim()) e.location = 'Location required';
    if (!form.UploadedFile) e.UploadedFile = 'Upload image';

    // 🔥 ADD THIS
    if (!form.phone || !phoneRegex.test(form.phone)) {
      e.phone = "Phone must be exactly 10 digits";
    }

    return e;
  }

  function handleNext(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setStep(2);
  }

  // Submit to backend
  // function handleSubmit() {
  //   const itemData = {
  //     itemname: form.name,
  //     price: form.price,
  //     image: "https://via.placeholder.com/150", // temp
  //     description: form.description,
  //     category: form.category,
  //     condition: form.condition,
  //     location: form.location,
  //     contact: form.phone
  //   };

  //   axios.post("http://localhost:9000/addItem", itemData)
  //     .then((res) => {
  //       alert(res.data);
  //       setSubmitted(true);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       alert("Error");
  //     });
  // }


  //   async function handleSubmit() {
  //   try {
  //     const formData = new FormData();

  //     formData.append("itemname", form.name);
  //     formData.append("price", form.price);
  //     formData.append("description", form.description);
  //     formData.append("category", form.category);
  //     formData.append("condition", form.condition);
  //     formData.append("location", form.location);
  //     formData.append("contact", form.phone);

  //      formData.append("sellerId", user._id);
  //     formData.append("sellerName", user.name);
  //     formData.append("sellerPhone", user.phone);

  //     //MOST IMPORTANT LINE
  //     formData.append("image", form.UploadedFile);

  //     const res = await axios.post(
  //       "http://localhost:9000/addItem",
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data"
  //         }
  //       }
  //     );

  //     alert(res.data);
  //     setSubmitted(true);

  //   } catch (err) {
  //     console.log(err);
  //     alert("Error uploading item");
  //   }
  // }






  async function handleSubmit() {
    if (!user) {
      setAlertMsg("Please login first to sell items");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("itemname", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("condition", form.condition);
      formData.append("location", form.location);
      formData.append("contact", form.phone);

      // 🔥 DO NOT TRUST FRONTEND — but still send
      // formData.append("sellerId", user._id);
      // formData.append("sellerName", user.name);
      // formData.append("sellerPhone", user.phone);

      formData.append("image", form.UploadedFile);

      const res = await axios.post(
        "http://localhost:9000/addItem",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            userid: user._id   // 🔐 IMPORTANT
          }
        }
      );

      // alert(res.data);
      navigate("/Browse");


    } catch (err) {
      console.log(err);
      alert("Error uploading item");
    }
  }



  // Success page
  if (submitted) {
    return (
      <div className="sellPage">
        <div className="sellSuccess">
          <h2>Listing Posted!</h2>
          <p>{form.name} is now live.</p>
          <button className="btn" onClick={() => navigate('/Browse')}>Browse</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sellPage">
      <h1>Sell Your Item</h1>

      <div className="steps">
        <span className={step === 1 ? "active" : ""}>1. Details</span>
        <span className={step === 2 ? "active" : ""}>2. Preview</span>
      </div>

      {alertMsg && (
        <div className="customAlert">
          ⚠️ {alertMsg}
        </div>
      )}


      {step === 1 && (
        <form className="form" onSubmit={handleNext}>

          <input name="name" placeholder="Item Name" onChange={handleChange} />
          {errors.name && <p className="error">{errors.name}</p>}

          <input name="price" type="number" placeholder="Price" onChange={handleChange} />
          {errors.price && <p className="error">{errors.price}</p>}

          <select name="category" onChange={handleChange}>
            <option value="">Select Category</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>

          <select name="condition" onChange={handleChange}>
            <option value="used">Used</option>
            <option value="new">New</option>
          </select>

          <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>

          <input name="location" placeholder="Location" onChange={handleChange} />

          <input
            name="phone"
            placeholder="Phone"
            maxLength="10"
            inputMode="numeric"     // 📱 mobile numeric keyboard
            pattern="[0-9]*"        // HTML validation
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setForm(prev => ({ ...prev, phone: value }));
            }}
          />

          <input type="file" onChange={(e) =>
            setForm(prev => ({ ...prev, UploadedFile: e.target.files[0] }))
          } />

          <button className="btn">Preview →</button>
        </form>
      )}

      {step === 2 && (
        <div className="previewContainer">

          <div className="previewCard">

            {/* IMAGE */}
            <div className="previewImageBox">
              <img
                src={form.UploadedFile ? URL.createObjectURL(form.UploadedFile) : ""}
                alt="preview"
              />
            </div>

            {/* DETAILS */}
            <div className="previewDetails">
              <h2 className="previewTitle">{form.name}</h2>

              <h3 className="previewPrice">₹{form.price}</h3>

              <p className="previewCategory">
                {form.category} • {form.condition}
              </p>

              <p className="previewDesc">Description : {form.description}</p>

              <p className="previewLocation">Location : 📍{form.location}</p>

              <p className="previewContact">Phone No. : 📞{form.phone || "Not provided"}</p>

              {/* BUTTONS */}
              <div className="previewActions">
                <button className="editBtn" onClick={() => setStep(1)}>
                  Edit
                </button>

                <button className="postBtn" onClick={handleSubmit}>
                  Post Item
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}

export default Sellitem;