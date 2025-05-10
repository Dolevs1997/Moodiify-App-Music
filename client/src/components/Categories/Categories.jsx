/* eslint-disable react/prop-types */
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import Category from "../Category/Category";
import styles from "./Categories.module.css";
import { Link, useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
function Categories({ user }) {
  const [categories, setCategories] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [showLess, setShowLess] = useState(true);
  let limit = categories.length === 0 ? 6 : categories.length;
  const navigate = useNavigate();
  if (!user.token) {
    navigate("/login");
  }
  if (user.token === "undefined") {
    navigate("/login");
  }
  useEffect(
    function () {
      async function fetchGenres() {
        try {
          const response = await axios.get(
            `http://${SERVER_URL}/moodiify/categories/getAll?limit=${limit}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          setCategories(response.data.categories.items);
        } catch (error) {
          console.error("Error fetching categories:", error);
          toast.error("Error fetching categories", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            newestOnTop: true,
            rtl: false,
            draggable: true,
            theme: "light",
          });
        }
      }
      fetchGenres();
    },
    [limit, user.token, user]
  );

  async function handleShowCategories(show) {
    try {
      if (show == "show more") {
        setShowMore(true);
        setShowLess(false);
      } else if (show == "show less") {
        setShowLess(true);
        setShowMore(false);
      }

      limit = showMore ? 6 : 50;

      const response = await axios.get(
        `http://${SERVER_URL}/moodiify/categories/getAll?limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",

            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (response.status !== 200) {
        console.error("Error fetching categories:", response.statusText);
      } else {
        setCategories(response.data.categories.items);
        if (showMore === true && showLess === false) {
          navigate("/home");
        }
        if (showLess === true && showMore === false) {
          navigate("/home/categories");
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("unable to show more Categories", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        rtl: false,
        draggable: true,
        theme: "light",
      });
    }
  }

  return (
    <>
      <h1>Categories</h1>

      <ToastContainer />

      <div className={styles.categories}>
        {categories
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => (
            <Category
              key={category.id}
              category={category}
              token={user.token}
            />
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
