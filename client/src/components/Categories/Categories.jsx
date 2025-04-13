/* eslint-disable react/prop-types */
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Category from "../Category/Category";
import styles from "./Categories.module.css";
import { Link, useNavigate } from "react-router";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(true);
  let limit = categories.length === 0 ? 6 : categories.length;
  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchGenres() {
        const response = await axios.get(
          `http://${SERVER_URL}/moodiify/categories?limit=${limit}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setCategories(response.data.categories.items);
      }
      fetchGenres();
    },
    [limit, user.token]
  );

  async function handleShowCategories(show) {
    if (show == "show more") {
      setShowMore(true);
      setShowLess(false);
    } else if (show == "show less") {
      setShowLess(true);
      setShowMore(false);
    }

    limit = showMore ? 6 : 50;

    const response = await axios.get(
      `http://${SERVER_URL}/moodiify/categories?limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${user.token}`,
        },
      }
    );

    setCategories(response.data.categories.items);
    if (showMore == true && showLess == false) {
      navigate("/home");
    }
    if (showLess == true && showMore == false) {
      navigate("/home/categories");
    }
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
      {!showMore && (
        <Link
          className="link"
          onClick={() => handleShowCategories("show more")}
        >
          Show More
        </Link>
      )}

      {!showLess && (
        <Link
          className="link"
          onClick={() => handleShowCategories("show less")}
        >
          Show less
        </Link>
      )}
    </>
  );
}

export default Categories;
