/* eslint-disable react/prop-types */
import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import styles from "./NavBar.module.css";
function NavBar({ handleFormVisible, handleVoiceSearch }) {
  return (
    <nav className={styles.navBar}>
      <ul>
        <Logo />
        <Search
          handleFormVisible={handleFormVisible}
          handleVoiceSearch={handleVoiceSearch}
        />
      </ul>
    </nav>
  );
}

export default NavBar;
