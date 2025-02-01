import Genres from "../components/Genres/Genres";
import NavBar from "../components/NavBar/NavBar";
export default function Home() {
  return (
    <main className="homePage">
      <NavBar />
      <Genres />
    </main>
  );
}
