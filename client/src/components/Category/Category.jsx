/* eslint-disable react/prop-types */
import styles from "./Category.module.css";

function Category({ category }) {
  return (
    <div className={styles.category}>
      <img src={category.icons[0].url} alt={category.name} />
      <h3>{category.name}</h3>
    </div>
  );
}

export default Category;
