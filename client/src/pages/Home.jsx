import Categories from "../components/Categories/Categories";
import NavBar from "../components/NavBar/NavBar";
export default function Home() {
  return (
    <main className="homePage">
      <NavBar />
      <Categories />
    </main>
  );
}
