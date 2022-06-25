import React, { useState, useEffect, useContext } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
// import Box from "../../components/Box";
// import EditIcon from "@mui/icons-material/Edit";
import AcceptIcon from "@mui/icons-material/CheckCircle";
import AuthContext from "../../store/AuthContext";
import GroupContext from "../../store/GroupContext";
import styles from "./Outstanding.module.css";

export default function GroupOutstanding() {
  const initialToken = localStorage.getItem("token");
  const authCtx = useContext(AuthContext);
  const grpCtx = useContext(GroupContext);
  const notifications = grpCtx.findNotifications(authCtx.username);
  const [currNotifications, setCurrNotifications] = useState(notifications);

  useEffect(() => {
    const notifications = grpCtx.findNotifications(authCtx.username);
    setCurrNotifications(notifications);
  }, [grpCtx]);

  const handleAcceptNotifications = (entry) => {
    return () => {
      console.log(entry);
      const grpID = entry.groupID;
      delete entry["groupName"];
      delete entry["groupID"];
      console.log(entry);
      const url = "http://localhost:8080/api/group/acknowledge";
      fetch(url, {
        method: "PUT",
        // body: JSON.stringify(base),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + initialToken,
        },
        body: JSON.stringify({
          groupID: grpID,
          userLog: entry,
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
          // grpCtx.deleteGroupWithID(groupID);
          // grpCtx.setDataFetched(false);
          grpCtx.accepNotification(grpID, entry);
          console.log("Successfully accepted notification");
        });
    };
  };

  return (
    <>
      <Row className="align-items-center pb-3">
        <Col xs="auto">
          {" "}
          <h2>Outstanding Payments</h2>
        </Col>
        <Col xs="auto"> </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th> Date </th>
            <th>Group</th>
            <th>Initiating Member</th>
            <th>Amount($)</th>
            <th>Confirm</th>
          </tr>
        </thead>
        <tbody>
          {currNotifications.map((entry) => {
            return (
              <tr>
                <td className="py-3">{new Date(entry.date).toDateString()}</td>
                <td className="py-3">{entry.groupName}</td>
                <td className="py-3">{entry.targetUsername}</td>
                <td className="py-3">{Number(entry.amount).toFixed(2)}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={handleAcceptNotifications(entry)}
                  >
                    <AcceptIcon />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {currNotifications.length == 0 && (
        <p className={"p-5 " + styles.noGroupMessage}>
          You have no group payments to acknowledge at the moment
        </p>
      )}
    </>
  );
}
