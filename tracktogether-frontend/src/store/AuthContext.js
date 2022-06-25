import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  id: "",
  username: "",
  email: "",
  contact: "",
  image: "",
  isLoggedIn: false,
  isDataFetched: false,
  login: () => {},
  datalog: () => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token") || props.token;
  console.log(initialToken);

  // const productionMode = typeof props.data === "undefined";

  // const [token, setToken] = useState(productionMode ? initialToken : null);

  // const [accountDetails, setAccountDetails] = useState(
  //   productionMode
  //     ? {
  //         id: null,
  //         username: null,
  //         email: null,
  //         contact: null,
  //         image: null,
  //       }
  //     : props.data.accountDetails
  // );

  // const [dataFetched, setDataFetched] = useState(productionMode ? false : true);
  const [token, setToken] = useState(initialToken);
  const [accountDetails, setAccountDetails] = useState({
    id: null,
    username: null,
    email: null,
    contact: null,
    image: null,
  });

  const [dataFetched, setDataFetched] = useState(false);
  // console.log(accountDetails);

  const fetchData = (token) => {
    if (!token) {
      return;
    }
    const url = "http://localhost:8080/api/account/refresh";
    console.log("fetching data in auth context");
    setDataFetched(true);
    fetch(url, {
      method: "GET",
      // body: JSON.stringify(base),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage; // = 'Authentication failed!';
            console.log(JSON.stringify(data));
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            console.log(errorMessage);

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        // setDataFetched(true);
        let account = data.data.account;

        // setToken(null);
        setAccountDetails({
          id: account._id,
          username: account.username,
          email: account.email,
          contact: account.contact,
          image: account.image,
        });

        console.log("Successfully refreshed!");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  // const initialId = localStorage.getItem("id");
  const userIsLoggedIn = !!token;

  if (!dataFetched && initialToken != null) {
    fetchData(initialToken);
  }

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    fetchData(token);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    setAccountDetails({
      id: null,
      username: null,
      email: null,
      contact: null,
      image: null,
    });
    setDataFetched(false);
    console.log("Successfully logged out!");
    // localStorage.removeItem("id");
  };

  const contextValue = {
    token: token,
    id: accountDetails.id,
    username: accountDetails.username,
    email: accountDetails.email,
    contact: accountDetails.contact,
    image: accountDetails.image,
    isLoggedIn: userIsLoggedIn,
    isDataFetched: dataFetched,

    login: loginHandler,
    // datalog: loginData,
    logout: logoutHandler,
    fetchData: fetchData,
    // optionState: optionState,
    // setOptionState: setOptionState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
