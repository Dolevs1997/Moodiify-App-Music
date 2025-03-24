/* eslint-disable react/prop-types */
import styles from "./Form.module.css";
import { useState } from "react";
import { getSongSuggestions } from "../../services/OpenAI_service";

function Form({ setSongSuggestions, handleFormVisible }) {
  const [text, setText] = useState("I want you to generate ");

  async function handleSubmit(e) {
    e.preventDefault();
    const text = document.getElementById("text").value;
    const response = await getSongSuggestions(text);
    setSongSuggestions(response);

    handleFormVisible();
    setText("");
  }

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <form className={styles.form}>
      <label htmlFor="text">What is your mood today?</label>

      <textarea id="text" value={text} onChange={handleChange} />

      <button type="submit" onClick={(e) => handleSubmit(e)}>
        Send
      </button>
    </form>
  );
}

export default Form;
