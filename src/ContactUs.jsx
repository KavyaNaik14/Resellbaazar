import React, { useState } from "react";
import axios from "axios";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:9000/contact", form);

      alert(res.data); // success message

      setForm({
        name: "",
        email: "",
        message: ""
      });

    } catch (err) {
      console.log("❌ FRONTEND ERROR:", err.response?.data || err.message);
      alert("❌ Error sending message");
    }

    setLoading(false);
  }



  const [showAlert, setShowAlert] = useState(false);

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     await axios.post("http://localhost:9000/contact", form);

  //     setShowAlert(true); // show alert

  //     setTimeout(() => {
  //       setShowAlert(false); // hide after 3 sec
  //     }, 3000);

  //     setForm({ name: "", email: "", message: "" });

  //   } catch (err) {
  //     alert("Error sending message");
  //   }

  //   setLoading(false);
  // }

  return (
    <div className="contactPage">
      <h1>Contact Us</h1>

      <div className="contactContainer">
        {/* <div className="contactInfo">
          <p>📍 Bangalore, India</p>
          <p>📞 +91 9876543210</p>
          <p>📧 support@resellbazaar.com</p>
        </div> */}

        {showAlert && (
          <div className="customAlert">
            Message sent successfully!
          </div>
        )}
        <form className="contactForm" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;