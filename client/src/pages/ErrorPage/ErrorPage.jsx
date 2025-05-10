import styles from "./ErrorPage.module.css";
function ErrorPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.error}>Error⛔</h1>
      <h2 className={styles.error}>Page not found</h2>
      <p className={styles.error}>
        The page you are looking for might have been removed or is temporarily
        unavailable.
      </p>
      <p className={styles.error}>
        Please check the URL or go back to the homepage.
      </p>
    </div>
  );
}

export default ErrorPage;
