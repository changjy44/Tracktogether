import styles from "./Login.module.css";
import logo from "../../images/logo.png";
import LoginForm from "./LoginForm";
//import { BrowserRouter, Route, Routes } from 'react-router-dom';

function Login() {
  return (
    <div>
      <header className={styles.imagecontainer}>
        <img src={logo} alt="" className={styles.image} />
      </header>

      <main>
        <LoginForm />
      </main>
    </div>
  );
}

export default Login;
