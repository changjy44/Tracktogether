import React, { useContext, useEffect, useState } from "react";

import styles from "./GroupComponent.module.css";
// import imageAvatar from "../../../images/img_avatar.png";
// import AuthContext from "../../../store/AuthContext";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  //   //   Tabs,
  //   //   Tab,
  Table,
  //   //   Stack,
  //   Button,
  //   Image,
  //   Form,
  Row,
  Col,
  //   Modal,
  //   //   ListGroup,
  //   //   CloseButton,
  //   //   Container,
  //   // Card,
  //   // Image,
  //   // Popover,
  //   // OverlayTrigger,
} from "react-bootstrap";
import { useParams } from "react-router-dom"; //useNavigate
import GroupContext from "../../../../store/GroupContext";

function GroupLogs() {
  // const navigation = useNavigate();
  // const initialToken = localStorage.getItem("token");
  // const authCtx = useContext(AuthContext);
  const groupID = useParams().groupID;

  const grpCtx = useContext(GroupContext);
  const groupInformation = grpCtx.findGroupWithID(groupID);
  const [currGrpLog, setCurrGrpLog] = useState(groupInformation.log);
  useEffect(() => {
    const groupInformation = grpCtx.findGroupWithID(groupID);
    setCurrGrpLog(groupInformation.log);
  }, [grpCtx]);

  return (
    <>
      <Row>
        <Col className="mb-3" xs="auto">
          {" "}
          <h2> Group Transaction Logs</h2>
        </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th> S/N </th>
            <th>Date</th>
            <th>Username</th>
            <th>Amount Incurred($)</th>
          </tr>
        </thead>
        <tbody>
          {currGrpLog.map((entry, index) => {
            return (
              <tr>
                <td className="py-3">{index + 1} </td>
                <td className="py-3">{new Date(entry.date).toDateString()}</td>
                <td className="py-3">{entry.username}</td>
                <td
                  className={"py-3 " + styles.entryAmount}
                  style={{ color: entry.amount > 0 ? "red" : "green" }}
                >
                  <strong>{Number(entry.amount).toFixed(2)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      {currGrpLog.length === 0 && (
        <p className={"p-5 " + styles.noGroupMessage}>
          {" "}
          No group transaction information has been logged at the moment{" "}
        </p>
      )}
    </>
  );
}

export default GroupLogs;
