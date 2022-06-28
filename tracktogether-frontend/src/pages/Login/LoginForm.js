import user from "../../images/user.png";
import lock from "../../images/lock.png";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import Button from "@mui/material/Button";
import { purple } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import AuthContext from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

function LoginForm() {
  const ColorButton = styled(Button)(({ theme }) => ({
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  }));

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    setFormErrors(validate(credentials));
    setIsSubmit(true);
    setLoading(true);

    const url = global.baseURL + "/api/account/login";

    console.log(url);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
      // body: JSON.stringify(base),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            setLoading(false);
            setFormErrors(logError(data.message));
          });
        }
      })
      .then((data) => {
        // console.log(data.data.account);
        authCtx.login(data.data.token);
        // authCtx.datalog(data.data.account);
        console.log("working");
        navigation("/home");
        // location.reload();
      })
      .catch((err) => {
        //alert(err.message);
        console.log(err.message);
      });
  }

  const logError = (error) => {
    const errors = {};
    errors.name = error;
    return errors;
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(credentials);
    }
  }, [formErrors]);

  const validate = (values) => {
    const errors = {};
    if (!values.username || !values.password) {
      errors.name = "Error";
    }
    return errors;
  };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
        <div className={styles.input_container}>
          <img src={user} alt="user" className={styles.icon} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={styles.field}
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        <div className={styles.input_container}>
          <img src={lock} alt="password" className={styles.icon} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.field}
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <p></p>
        <div className="loginbutton">
          {loading ? (
            <Spinner animation="border" variant="primary" />
          ) : (
            <ColorButton variant="contained" type="submit">
              Log In
            </ColorButton>
          )}
        </div>
      </form>
      <div className={styles.link}>
        <a href="/">Forgot password?</a> or <Link to="/signup">Sign Up</Link>
      </div>
      <span style={{ color: "red" }}>{formErrors.name}</span>
      <br />
    </div>
  );
}
export default LoginForm;
