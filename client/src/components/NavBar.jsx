import Logo from "./Logo";
import Search from "./Search";
function NavBar() {
  return (
    <nav className="nav-bar">
      <ul>
        <Logo />
        <Search />
      </ul>
    </nav>
  );
}

export default NavBar;
