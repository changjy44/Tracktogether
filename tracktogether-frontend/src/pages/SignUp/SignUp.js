import styles from "./SignUp.module.css";
import logo from "../../images/logo.png";
import SignUpForm from "./SignUpForm";
//import { BrowserRouter, Route, Routes } from 'react-router-dom';

function SignUp() {
  return (
    <div className={styles.main}>
      <header className={styles.imagecontainer}>
        <img src={logo} alt="" className={styles.image} />
      </header>

      <main>
        <SignUpForm />
      </main>
    </div>
  );
}

export default SignUp;
