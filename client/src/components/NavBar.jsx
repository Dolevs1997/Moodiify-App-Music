export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}

      <span>home</span>
    </nav>
  );
}
