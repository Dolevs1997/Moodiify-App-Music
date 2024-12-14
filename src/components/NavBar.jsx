export default function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      {children}

      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&icon_names=home"
      />
      <span class="material-symbols-outlined">home</span>
    </nav>
  );
}
