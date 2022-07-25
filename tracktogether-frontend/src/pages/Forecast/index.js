import React, { useContext } from "react";
import Template from "../../components/Template";
import AuthContext from "../../store/AuthContext";
import Forecast from "./Forecast";
import Loading from "../../components/Loading/Loading";
// import { Spinner } from "react-bootstrap";

function ForecastCard() {
  const authCtx = useContext(AuthContext);

  return authCtx.authIsLoading ? (
    <Loading />
  ) : (
    <Template>
      <Forecast />
    </Template>
  );
}
export default ForecastCard;
