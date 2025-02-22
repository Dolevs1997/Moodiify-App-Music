import styles from "./Logo.module.css";
export default function Logo() {
  return (
    <div>
      <img src="/moodiify/logo-app.png" alt="logo" className={styles.logo} />
    </div>
  );
}
