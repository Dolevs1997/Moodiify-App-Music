import styles from "./Logo.module.css";
import { useNavigate } from "react-router";
export default function Logo() {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate("/home");
  };
  return (
    <div onClick={handleLogoClick}>
      <img src="/moodiify/logo-app.png" alt="logo" className={styles.logo} />
    </div>
  );
}
