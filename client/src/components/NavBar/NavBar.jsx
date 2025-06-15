/* eslint-disable react/prop-types */
import styles from "./NavBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function NavBar({ user }) {
  const navigate = useNavigate();
  async function handleLogout() {
    try {
      const response = await axios.get(
        `http://${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.refreshToken}`,
          },
        }
      );
      if (response.status === 204) {
        localStorage.removeItem("user");
        toast.success("Logout successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Logout failed! Please try again.");
    }
  }

  return (
    <nav className={styles.nav}>
      <Toaster />
      <NavLink to="/login" className="link" onClick={handleLogout}>
        Logout
      </NavLink>
    </nav>
  );
}

export default NavBar;
