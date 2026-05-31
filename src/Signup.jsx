import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    profilePic: ""
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [alertMsg, setAlertMsg] = useState("");

  function handlechange(e) {
    const { name, value } = e.target;
    setSignUpData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleSignup() {
    const { name, email, password, phone } = signUpData;

    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name.trim()) newErrors.name = "Name is required";

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address (e.g. example@gmail.com)";
    }

    if (!password.trim()) newErrors.password = "Password is required";

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);

    // ❌ stop if errors exist
    if (Object.keys(newErrors).length > 0) return;

    // ✅ API call
    axios
      .post("http://localhost:9000/signup", signUpData)
      .then((res) => {
        setAlertMsg(res.data);   // ✅ show custom alert

        setTimeout(() => {
          setAlertMsg("");
          navigate("/login");
        }, 2000);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          // ✅ handle both string OR object response
          const message =
            typeof err.response.data === "string"
              ? err.response.data
              : err.response.data.message || "Account already exists";

          setAlertMsg(message);
        } else {
          setAlertMsg("Error creating account");
        }

        setTimeout(() => {
          setAlertMsg("");
        }, 2000);
      });
  }

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/Browse");
    }
  }, [navigate]);

  return (
    <div className="signupContainer">
      <div className="signUpSection">
        <div className="signupForm">
          <h2>Sign Up</h2>
          {alertMsg && <div className="customAlert">{alertMsg}</div>}  {/* 👈 ADD HERE */}


          <TextField
            label="User Name"
            name="name"
            onChange={handlechange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="User Email"
            name="email"
            onChange={handlechange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Password"
            type="password"
            name="password"
            onChange={handlechange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />

          <TextField
            label="Phone Number"
            name="phone"
            value={signUpData.phone}
            inputProps={{ maxLength: 10 }}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              setSignUpData(prev => ({ ...prev, phone: value }));
            }}
            error={!!errors.phone}
            helperText={errors.phone}
            fullWidth
          />

          <Button variant="contained" onClick={handleSignup}>
            Sign Up
          </Button>
        </div>

        <div className="SignupImg"></div>
      </div>
    </div>
  );
}

export default Signup;