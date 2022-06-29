import React, { useContext } from "react";
import Template from "../../components/Template";
import AuthContext from "../../store/AuthContext";
import Home from "./Home";
import Loading from "../../components/Loading/Loading";
// import { Spinner } from "react-bootstrap";

function HomeCard() {
  const authCtx = useContext(AuthContext);

  return authCtx.authIsLoading ? (
    <Loading />
  ) : (
    <Template>
      <Home />
    </Template>
  );
}
export default HomeCard;
