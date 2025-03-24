import Categories from "../components/Categories/Categories";
import NavBar from "../components/NavBar/NavBar";
import { useState } from "react";
import Form from "../components/Form/Form";
import Songs from "../components/Songs/Songs";

export default function Home() {
  const [formVisible, setFormVisible] = useState(false);
  const [songSuggestions, setSongSuggestions] = useState([]);

  const handleFormVisible = () => setFormVisible(!formVisible);

  return (
    <main className="homePage">
      <NavBar handleFormVisible={handleFormVisible} />
      {formVisible && (
        <Form
          setSongSuggestions={setSongSuggestions}
          handleFormVisible={handleFormVisible}
        />
      )}
      {songSuggestions.length == 0 && <Categories />}
      {songSuggestions.length > 0 && (
        <Songs songSuggestions={songSuggestions} />
      )}
    </main>
  );
}
