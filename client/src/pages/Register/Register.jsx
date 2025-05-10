import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import axios from "axios";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleRegisteration = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    } else if (password.length < 6) {
      toast.error("Password must be at least 8 characters long");
      return;
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const payload = {
      username: username,
      email: email,
      password: password,
    };

    const response = await axios.post(
      `http://${SERVER_URL}/auth/register`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } else if (response.status == 409) {
      toast.error("User already exists! Please login.");
    } else if (response.status == 400) {
      toast.error("Bad request! Please check your input.");
    } else toast.error("Registration failed! Please try again.");
  };
  return (
    <form>
      <h2>Register</h2>
      <Toaster />
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label htmlFor="confirm-password">Confirm Password:</label>
      <input
        type="password"
        id="confirm-password"
        name="confirm-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Link to="/login">
        <Button onClick={handleRegisteration}>Register</Button>
      </Link>

      <p>
        Already have an account?
        <Link to="/login" className="link">
          {" "}
          Login here
        </Link>
      </p>
    </form>
  );
}

export default Register;
