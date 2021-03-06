//import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Box from "../../components/Box";
import styles from "./Forecast.module.css";
import React, {
  useState,
  useEffect,
  useContext,
  // useReducer,
  // useRef,
} from "react";
import AuthContext from "../../store/AuthContext";
import LineChart from "./PredictionLineChart";
import { Container, Row, Col, Spinner, Form } from "react-bootstrap";

function Forecast() {
  const authCtx = useContext(AuthContext);

  const [data, setData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [budget, setBudget] = useState(0);
  const [isDataFetched, setDataFetched] = useState(false);

  function filterData(data, budget) {
    return data
      .filter((item) => item.amount > budget)
      .map((item) => item.month);
  }

  useEffect(() => {
    const url = global.baseURL + "/api/account/tspredict";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            setErrorMessage(data.message);
            setDataFetched(true);
          });
        }
      })
      .then((data) => {
        setData(data.data);
        setDataFetched(true);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [authCtx]);

  return (
    <div className={styles.right}>
      <Box>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 className={styles.header}>
            Spending Forecast for Mr {authCtx.username}!
          </h2>
          <Form style={{ paddingRight: 150 }}>
            <Form.Label>Budget</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter budget"
              onChange={(e) => setBudget(e.target.value)}
            />
          </Form>
        </div>
        <Container>
          <Row>
            <Col
              className="my-3"
              sm={9}
              md={6}
              style={{ position: "relative" }}
            >
              <div>
                {isDataFetched ? (
                  errorMessage ? (
                    <p
                      style={{ fontWeight: "bold", color: "red" }}
                      className="p-5 ml-auto mr-auto"
                    >
                      {errorMessage}
                    </p>
                  ) : (
                    <LineChart data={data.rnn_data} type="rnn" />
                  )
                ) : (
                  // {/* <h4 className="p-5 ml-auto mr-auto"> Loading... </h4> */}

                  <Spinner
                    className="p-5 ml-auto mr-auto"
                    animation="border"
                    variant="primary"
                  />
                )}
              </div>
              <div>
                {budget ? (
                  errorMessage ? (
                    <p className="p-5 ml-auto mr-auto">
                      RNN model cannot predict for you yet! ????
                    </p>
                  ) : (
                    <span>
                      RNN model warns that you might exceed your budget of $
                      {budget} in the upcoming months:
                      <Row>
                        {filterData(data.rnn_data, budget).slice(0, 4).length >
                        0 ? (
                          <Col>
                            {filterData(data.rnn_data, budget)
                              .slice(0, 4)
                              .map((entry) => (
                                <li>{entry}</li>
                              ))}
                          </Col>
                        ) : null}
                        {filterData(data.rnn_data, budget).slice(4, 8).length >
                        0 ? (
                          <Col>
                            {filterData(data.rnn_data, budget)
                              .slice(4, 8)
                              .map((entry) => (
                                <li>{entry}</li>
                              ))}
                          </Col>
                        ) : null}
                        {filterData(data.rnn_data, budget).slice(8, 12).length >
                        0 ? (
                          <Col>
                            {filterData(data.rnn_data, budget)
                              .slice(8, 12)
                              .map((entry) => (
                                <li>{entry}</li>
                              ))}
                          </Col>
                        ) : null}
                      </Row>
                    </span>
                  )
                ) : null}
              </div>
            </Col>
            <Col
              className="my-3"
              sm={9}
              md={6}
              style={{ position: "relative" }}
            >
              <div>
                {isDataFetched ? (
                  errorMessage ? (
                    <p
                      style={{ fontWeight: "bold", color: "red" }}
                      className="p-5 ml-auto mr-auto"
                    >
                      {errorMessage}
                    </p>
                  ) : (
                    <LineChart data={data.sarima_data} type="sarima" />
                  )
                ) : (
                  <Spinner
                    className="p-5 ml-auto mr-auto"
                    animation="border"
                    variant="primary"
                  />
                )}
              </div>
              <div>
                {budget ? (
                  errorMessage ? (
                    <p className="p-5 ml-auto mr-auto">
                      ARIMA model cannot predict for you yet! ????
                    </p>
                  ) : (
                    <span>
                      SARIMA model warns that you might exceed your budget of $
                      {budget} in the upcoming months:
                      <Row>
                        {filterData(data.sarima_data, budget).slice(0, 4)
                          .length > 0 ? (
                          <Col>
                            {filterData(data.sarima_data, budget)
                              .slice(0, 4)
                              .map((entry) => (
                                <li>{entry}</li>
                              ))}
                          </Col>
                        ) : null}
                        {filterData(data.sarima_data, budget).slice(4, 8)
                          .length > 0 ? (
                          <Col>
                            {filterData(data.sarima_data, budget)
                              .slice(4, 8)
                              .map((entry) => (
                                <li>{entry}</li>
                              ))}
                          </Col>
                        ) : null}
                        {filterData(data.sarima_data, budget).slice(8, 12)
                          .length > 0 ? (
                          <Col>
                            {filterData(data.sarima_data, budget)
                              .slice(8, 12)
                              .map((entry) => (
                                <li>{entry}</li>
                              ))}
                          </Col>
                        ) : null}
                      </Row>
                    </span>
                  )
                ) : null}
              </div>
            </Col>
          </Row>
        </Container>
      </Box>
    </div>
  );
}

export default Forecast;
