import ReactLoading from "react-loading";
import styles from "./loading.module.css";

function PageLoading() {
  return (
    <ReactLoading
      className={styles.pageloading}
      type="bubbles"
      color="#0000FF"
      height={200}
      width={100}
    />
  );
}

export default PageLoading;
