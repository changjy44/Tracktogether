import ReactLoading from "react-loading";
import styles from "./loading.module.css";

function Loading() {
  return (
    <ReactLoading
      className={styles.loading}
      type="bubbles"
      color="#0000FF"
      height={200}
      width={100}
    />
  );
}

export default Loading;
