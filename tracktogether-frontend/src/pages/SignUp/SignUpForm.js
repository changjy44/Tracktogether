import user from "../../images/user.png";
import lock from "../../images/lock.png";
import emailicon from "../../images/email.png";
import phone from "../../images/phone.png";
import React, { useState, useEffect, useContext } from "react";
import styles from "./SignUp.module.css";
// import Button from "@mui/material/Button";
import { Button } from "react-bootstrap";
// import { purple } from "@mui/material/colors";
// import { styled } from "@mui/material/styles";
import AuthContext from "../../store/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function SignUpForm() {
  /*
  Validation: All fields must be non empty.
  Contact number must be 8 digits long
  Email: must have @
  Password: must be 8 characters long
  Confirm Password: must be same as password
  */
  const [credentials, setCredentials] = useState({
    username: "",
    email: "",
    contactNo: "",
    password: "",
    cfmPassword: "",
  });

  const [credentialsIsValid, setCredentialsIsValid] = useState({
    username: {
      isValid: false,
      isTouched: false,
      errorMessage: "",
    },
    email: {
      isValid: false,
      isTouched: false,
      errorMessage: "",
    },
    contactNo: {
      isValid: false,
      isTouched: false,
      errorMessage: "",
    },
    password: {
      isValid: false,
      isTouched: false,
      errorMessage: "",
    },
    cfmPassword: {
      isValid: false,
      isTouched: false,
      errorMessage: "",
    },
  });

  const handleUserBlur = (e) => {
    function helper(name) {
      switch (name) {
        case "username":
          newCredentialsValid.username.isTouched = true;
          break;
        case "email":
          newCredentialsValid.email.isTouched = true;
          break;
        case "contactNo":
          newCredentialsValid.contactNo.isTouched = true;
          break;
        case "password":
          newCredentialsValid.password.isTouched = true;
          break;
        case "cfmPassword":
          newCredentialsValid.cfmPassword.isTouched = true;
      }
    }
    const name = e.target.name;
    const newCredentialsValid = {
      ...credentialsIsValid,
    };
    helper(name);
    strokeValidate(name, e.target.value);
    setCredentialsIsValid(newCredentialsValid);
  };

  const strokeValidate = (name, value) => {
    function isEmpty(value) {
      return value.trim() === "";
    }

    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const newCredentialsValid = {
      ...credentialsIsValid,
    };

    switch (name) {
      case "username":
        if (isEmpty(value)) {
          newCredentialsValid.username.errorMessage =
            "Please enter a nonempty username!";
          newCredentialsValid.username.isValid = false;
        } else {
          newCredentialsValid.username.errorMessage = "";
          newCredentialsValid.username.isValid = true;
        }
        break;
      case "email":
        if (isEmpty(value)) {
          newCredentialsValid.email.errorMessage =
            "Please enter a nonempty email!";
          newCredentialsValid.email.isValid = false;
        } else if (!validateEmail(value)) {
          newCredentialsValid.email.errorMessage =
            "Please enter a valid email!";
          newCredentialsValid.email.isValid = false;
        } else {
          newCredentialsValid.email.errorMessage = "";
          newCredentialsValid.email.isValid = true;
        }
        break;
      case "contactNo":
        if (isEmpty(value)) {
          newCredentialsValid.contactNo.errorMessage =
            "Please enter a nonempty contactNo!";
          newCredentialsValid.contactNo.isValid = false;
        } else if (value.length != 8) {
          newCredentialsValid.contactNo.errorMessage =
            "Please enter 8 digits for contact number!";
          newCredentialsValid.contactNo.isValid = false;
        } else {
          newCredentialsValid.contactNo.errorMessage = "";
          newCredentialsValid.contactNo.isValid = true;
        }
        break;
      case "password":
        if (isEmpty(value)) {
          newCredentialsValid.password.errorMessage =
            "Please enter a nonempty password!";
          newCredentialsValid.password.isValid = false;
        } else if (value.length < 8) {
          newCredentialsValid.password.errorMessage =
            "Please enter at least 8 characters for password!";
          newCredentialsValid.password.isValid = false;
        } else {
          newCredentialsValid.password.errorMessage = "";
          newCredentialsValid.password.isValid = true;
        }
        break;
      case "cfmPassword":
        if (isEmpty(value)) {
          newCredentialsValid.cfmPassword.errorMessage =
            "Please enter a nonempty cfmPassword!";
          newCredentialsValid.cfmPassword.isValid = false;
        } else if (value != credentials.password) {
          newCredentialsValid.cfmPassword.errorMessage =
            "Your passwords must match!";
          newCredentialsValid.cfmPassword.isValid = false;
        } else {
          newCredentialsValid.cfmPassword.errorMessage = "";
          newCredentialsValid.cfmPassword.isValid = true;
        }
        break;
    }
    setCredentialsIsValid(newCredentialsValid);
  };

  const displayUsernameError =
    credentialsIsValid.username.isTouched &&
    !credentialsIsValid.username.isValid;

  const displayEmailError =
    credentialsIsValid.email.isTouched && !credentialsIsValid.email.isValid;

  const displayContactNoError =
    credentialsIsValid.contactNo.isTouched &&
    !credentialsIsValid.contactNo.isValid;

  const displayPasswordError =
    credentialsIsValid.password.isTouched &&
    !credentialsIsValid.password.isValid;

  const displayConfirmPasswordError =
    credentialsIsValid.cfmPassword.isTouched &&
    !credentialsIsValid.cfmPassword.isValid;

  const formValidity =
    credentialsIsValid.username.isValid &&
    credentialsIsValid.email.isValid &&
    credentialsIsValid.contactNo.isValid &&
    credentialsIsValid.password.isValid &&
    credentialsIsValid.cfmPassword.isValid;

  const [formErrors, setFormErrors] = useState("");

  const [isSubmit, setIsSubmit] = useState(false);

  const navigation = useNavigate();
  const authCtx = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
    strokeValidate(name, value);
  };

  function handleSubmit(event) {
    event.preventDefault();
    // authCtx.login('dummydata');
    // navigation("/");
    // setFormErrors(validate(credentials));
    setIsSubmit(true);

    const url = "http://localhost:8080/api/account";
    console.log(credentials.contactNo);
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        username: credentials.username,
        email: credentials.email,
        contact: credentials.contactNo,
        password: credentials.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            // const logError = (error) => {
            //   const errors = {};
            //   errors.name = error;
            //   return errors;
            // };

            // let errorMessage; // = 'Authentication failed!';
            // console.log(JSON.stringify(data));
            // if (data && data.error && data.error.message) {
            //   errorMessage = data.error.message;
            //   setFormErrors(errorMessage);
            // }
            // console.log(errorMessage);
            setFormErrors(data.message);

            // throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // console.log(data.data.account);
        authCtx.login(data.data.token);
        // authCtx.datalog(data.data.account);
        console.log("working");
        navigation("/");
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(credentials);
    }
  }, [formErrors]);

  // const validate = (values) => {
  //   const errors = {};
  //   if (
  //     !values.username ||
  //     !values.email ||
  //     !values.contactNo ||
  //     !values.password ||
  //     !values.cfmPassword
  //   ) {
  //     errors.name = "Please key in all required fields";
  //   }
  //   return errors;
  // };

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
        <p>
          <img src={user} alt="user" className={styles.icon} />
          <input
            type="text"
            name="username"
            placeholder="Username"
            className={styles.field}
            value={credentials.username}
            onChange={handleChange}
            onBlur={handleUserBlur}
          />
        </p>
        {displayUsernameError && (
          <p role="error" style={{ color: "red" }}>
            {credentialsIsValid.username.errorMessage}{" "}
          </p>
        )}

        <p>
          <img src={emailicon} alt="email" className={styles.icon} />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className={styles.field}
            value={credentials.email}
            onChange={handleChange}
            onBlur={handleUserBlur}
          />
        </p>
        {displayEmailError && (
          <p role="error" style={{ color: "red" }}>
            {credentialsIsValid.email.errorMessage}{" "}
          </p>
        )}
        <p>
          <img src={phone} alt="contactNo" className={styles.icon} />
          <input
            type="number"
            name="contactNo"
            placeholder="Contact Number"
            className={styles.field}
            value={credentials.contactNo}
            onChange={handleChange}
            onBlur={handleUserBlur}
          />
        </p>
        {displayContactNoError && (
          <p role="error" style={{ color: "red" }}>
            {credentialsIsValid.contactNo.errorMessage}{" "}
          </p>
        )}
        <p>
          <img src={lock} alt="password" className={styles.icon} />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className={styles.field}
            value={credentials.password}
            onChange={handleChange}
            onBlur={handleUserBlur}
          />
        </p>
        {displayPasswordError && (
          <p role="error" style={{ color: "red" }}>
            {credentialsIsValid.password.errorMessage}{" "}
          </p>
        )}
        <p>
          <img src={lock} alt="password" className={styles.icon} />
          <input
            type="password"
            name="cfmPassword"
            placeholder="Confirm Password"
            className={styles.field}
            value={credentials.cfmPassword}
            onChange={handleChange}
            onBlur={handleUserBlur}
          />
        </p>
        {displayConfirmPasswordError && (
          <p role="error" style={{ color: "red" }}>
            {credentialsIsValid.password.errorMessage}{" "}
          </p>
        )}

        <Button
          size="lg"
          className="m-3"
          disabled={!formValidity}
          type="submit"
        >
          Sign Up
        </Button>
      </form>
      <div className={styles.link}>
        <span>Already have an account?</span> <Link to="/">Login</Link>
      </div>
      {formErrors !== "" && (
        <p>
          <span style={{ color: "red" }}>{formErrors}</span>
        </p>
      )}
    </div>
  );
}

export default SignUpForm;
