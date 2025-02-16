import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Category from "../Category/Category";
import styles from "./Categories.module.css";
function Categories() {
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  let limit = categories.length === 0 ? 6 : categories.length;
  useEffect(
    function () {
      console.log("fetching genres");
      async function fetchGenres() {
        const response = await axios.get(
          `http://10.0.0.25:3001/moodiify/categories?limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log(response.data);
        setCategories(response.data.categories.items);
      }
      fetchGenres();
    },
    [limit]
  );

  async function handleShowCategories() {
    setShowMore(!showMore);
    limit = showMore ? 6 : 50;
    console.log("fetching genres");
    console.log(limit);
    console.log(showMore);
    const response = await axios.get(
      `http://10.0.0.25:3001/moodiify/categories?limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setCategories(response.data.categories.items);
  }

  return (
    <>
      <h1>Categories</h1>
      <div className={styles.categories}>
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <Category key={category.id} category={category} />
          ))}
      </div>
      <span onClick={handleShowCategories}>{showMore ? "" : "Show More"}</span>
    </>
  );
}

export default Categories;
