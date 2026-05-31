import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/Browse");
    }
  }, [navigate]);

  function handlechange(e) {
    const { name, value } = e.target;

    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));

    setErrorMsg(""); // clear error while typing
  }

  //  REAL LOGIN
  const [errorMsg, setErrorMsg] = useState("");
  async function handleLogin() {
    try {
      const res = await axios.post(
        "http://localhost:9000/login",
        loginData
      );

      //  SUCCESS
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("storage"));
      navigate("/Browse");

      // alert("Login successful");
      // navigate("/Browse");

    } catch (err) {


      if (err.response && err.response.status === 401) {
        setErrorMsg("Invalid email or password");
      } else {
        setErrorMsg("Server error, try again");
      }

      console.log(err);
    }
  }
  return (
    <div className="LoginWrapper">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "30px",
          width: "30%",
          backgroundColor: "#ffffff",
          boxShadow: "0px 0px 3px 3px #f1f1f1",
          padding: "40px",
          borderRadius: "10px",
        }}
      >
        <h1>Login</h1>

        {errorMsg && <p className="errorMsg">{errorMsg}</p>}

        <TextField
          label="Email"
          name="email"
          value={loginData.email}
          onChange={handlechange}
        />

        <TextField
          label="Password"
          type="password"
          name="password"
          value={loginData.password}
          onChange={handlechange}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleLogin}
        >
          Login
        </Button>
      </Box>
    </div>
  );
}

export default Login;