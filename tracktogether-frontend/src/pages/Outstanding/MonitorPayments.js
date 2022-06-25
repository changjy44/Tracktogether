import React, { useEffect, useState, useContext } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import AuthContext from "../../store/AuthContext";
// import Box from "../../components/Box";
import FilterContext from "../../store/FilterContext";
import styles from "./Outstanding.module.css";

export default function MonitorPayments() {
  const initialToken = localStorage.getItem("token");
  // console.log(initialToken);
  const authCtx = useContext(AuthContext);
  const filterCtx = useContext(FilterContext);

  const [alert, setAlert] = useState(
    filterCtx.alertData.filter((entry) => entry.amount < 0)
  );

  useEffect(() => {
    setAlert(filterCtx.alertData.filter((entry) => entry.amount < 0));
  }, [filterCtx]);

  function handleReceivedPayment(index) {
    console.log("clicked button");
    return () => {
      const entry = alert[index];
      const url = "http://localhost:8080/api/account/alerts";
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
          console.log("received data");
          // const newGroupData = data.data;
          // grpCtx.updateGroupInformation(groupID, newGroupData);
          // grpCtx.updateGroupMemberListWithID(groupID, username);
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
          <h2>Payments to you</h2>
        </Col>
        <Col xs="auto"> </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Group</th>
            <th>Payment from</th>
            <th>Contact</th>
            <th>Amount($)</th>
          </tr>
        </thead>
        <tbody>
          {alert.map((entry, index) => {
            return (
              <tr>
                <td>{entry.group}</td>
                <td>{entry.user}</td>
                <td>{entry.contact}</td>
                <td>{Number(-entry.amount).toFixed(2)}</td>
                <td>
                  <Button
                    disabled={!entry.payeeHasPaid}
                    onClick={handleReceivedPayment(index)}
                  >
                    {" "}
                    Received payment{" "}
                  </Button>{" "}
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {alert.length == 0 && (
        <p className={"p-5 " + styles.noGroupMessage}>
          You have no one that owe you money at the moment
        </p>
      )}
    </>
  );
}
