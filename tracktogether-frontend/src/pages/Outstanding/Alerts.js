import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
// import Box from "../../components/Box";
import PaidIcon from "@mui/icons-material/Paid";
import FilterContext from "../../store/FilterContext";
import styles from "./Outstanding.module.css";
import AuthContext from "../../store/AuthContext";

export default function Alerts() {
  const initialToken = localStorage.getItem("token");
  const authCtx = useContext(AuthContext);
  const filterCtx = useContext(FilterContext);

  const [alert, setAlert] = useState(
    filterCtx.alertData.filter((entry) => entry.amount > 0)
  );

  useEffect(() => {
    setAlert(filterCtx.alertData.filter((entry) => entry.amount > 0));
  }, [filterCtx]);

  function handleAlert(index) {
    return () => {
      const entry = alert[index];
      const url = global.baseURL + "/api/account/alerts";
      fetch(url, {
        method: "PUT",
        // body: JSON.stringify(base),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + initialToken,
        },
        body: JSON.stringify({
          username: authCtx.username,
          alert: entry,
        }),
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            console.log(res.json().data.message);
          }
        })
        .then(() => {
          const newAlert = [...alert];
          newAlert.splice(index, 1);
          setAlert(newAlert);
          console.log("Successfully cleared alerts");
        });
    };
  }

  return (
    <>
      <Row className="align-items-center pb-3">
        <Col xs="auto">
          {" "}
          <h2>Alerts</h2>
        </Col>
        <Col xs="auto"> </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Group</th>
            <th>Payment to</th>
            <th>Contact</th>
            <th>Amount($)</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {alert.map((entry, idx) => {
            return (
              <tr>
                <td>{entry.group}</td>
                <td>{entry.user}</td>
                <td>{entry.contact}</td>
                <td>{Number(entry.amount).toFixed(2)}</td>
                <td>
                  <Button variant="success" onClick={handleAlert(idx)}>
                    <PaidIcon /*style={{ color: "green" }}*/ />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {alert.length == 0 && (
        <p className={"p-5 " + styles.noGroupMessage}>
          You have no oustanding payments at the moment
        </p>
      )}
    </>
  );
}
