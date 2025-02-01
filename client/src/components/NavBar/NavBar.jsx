import Logo from "../Logo/Logo";
import Search from "../Search/Search";
import styles from "./NavBar.module.css";
function NavBar() {
  return (
    <nav className={styles.navBar}>
      <ul>
        <Logo />
        <Search />
      </ul>
    </nav>
  );
}

export default NavBar;
