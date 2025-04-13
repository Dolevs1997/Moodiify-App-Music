/* eslint-disable react/prop-types */
import styles from "./Button.module.css";
function Button({ children, onClick }) {
  return (
    <button className={styles.button} type="submit" onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
