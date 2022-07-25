//import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Box from "../../components/Box";
import styles from "./Home.module.css";
import React, {
  useState,
  useEffect,
  useContext,
  // useReducer,
  // useRef,
} from "react";
import AuthContext from "../../store/AuthContext";
import DonutChart from "../../charts/DonutChart";
import BarChart from "../../charts/BarChart";
import LineChart from "../../charts/LineChart";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import FilterContext from "../../store/FilterContext";
import GroupContext from "../../store/GroupContext";
// import MultilineChart from "../../charts/LineChartD3";

function Home() {
  const authCtx = useContext(AuthContext);
  console.log("rendering home");
  // console.log(authCtx);
  const filterCtx = useContext(FilterContext);
  console.log(filterCtx);

  const grpCtx = useContext(GroupContext);
  console.log(grpCtx);

  const initialValues = {
    quote: [],
    pieData: [{ category: "Loading...", amount: 100 }],
    lineData: [],
    barData: [],
  };

  // const [data, dispatch] = useReducer(reducer, initialValues);

  const [data, setData] = useState(initialValues);

  function getRndInteger(max) {
    return Math.floor(Math.random() * max);
  }

  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    let isCancelled = false;
    console.log("entering home useEffect frame");
    const fetchData = async () => {
      const url = global.baseURL + "/api/account/quote";
      const quote_result = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + authCtx.token,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let quote = data.data.quotes[getRndInteger(418)];
          return [quote.quote, quote.author];
        });

      await timeout(500);
      console.log(isCancelled);

      if (!isCancelled) {
        console.log("setting all data in Home");
        setData({
          quote: quote_result,
          pieData: filterCtx.localData,
          lineData: filterCtx.localData,
          barData: grpCtx.group,
        });
      }
    };

    if (filterCtx.isDataFetched) {
      fetchData();
    }
    //cleanup function is executed when useEffect is called again or on unmount
    return () => {
      isCancelled = true;
    };
  }, [filterCtx, grpCtx]);

  return (
    <div className={styles.right}>
      <Box>
        <h2 className={styles.header}>Welcome Mr {authCtx.username}!</h2>
        <Container>
          <Row>
            <Col className="my-3" sm={12} md={4}>
              <DonutChart data={data.pieData} />
            </Col>
            <Col
              className="my-3"
              sm={12}
              md={4}
              style={{ position: "relative" }}
            >
              {data.quote.length != 0 ? (
                // <MultilineChart
                //   inputData={data.lineData}
                //   dimensions={{
                //     width: 600,
                //     height: 300,
                //     margin: { top: 30, right: 30, bottom: 30, left: 60 },
                //   }}
                // />
                <LineChart data={data.lineData} />
              ) : (
                <div className={styles.spinner}>
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
            </Col>
            <Col
              className="my-3"
              sm={12}
              md={4}
              style={{ position: "relative" }}
            >
              {data.quote.length == 0 ? (
                <div className={styles.spinner}>
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <BarChart data={data.barData} />
              )}
            </Col>
          </Row>
        </Container>
      </Box>

      <Box>
        <div data-testid="quote">
          <h4 className={styles.header}>Quote of the Day</h4>
          {data.quote.length == 0 ? (
            <Col style={{ position: "relative" }}>
              <div className={styles.spinner}>
                <Spinner animation="border" variant="primary" />
              </div>
              <br></br>
              <br></br>
            </Col>
          ) : (
            <div>
              <span className={styles.quote}>"{data.quote[0]}"</span>
              <p>-{data.quote[1]}-</p>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
}

export default Home;
