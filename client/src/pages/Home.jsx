import Categories from "../components/Categories/Categories";
import NavBar from "../components/NavBar/NavBar";
import { useState } from "react";
import Form from "../components/Form/Form";
export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const handleFormVisible = () => setFormVisible(!formVisible);
  return (
    <main className="homePage">
      <NavBar handleFormVisible={handleFormVisible} />
      {formVisible && <Form />}
      <Categories />
    </main>
  );
}
