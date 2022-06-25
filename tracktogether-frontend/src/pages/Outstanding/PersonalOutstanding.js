import React from "react";
// import { Row, Col, Table } from "react-bootstrap";
// import Box from "../../components/Box";
// import EditIcon from "@mui/icons-material/Edit";
// import AcceptIcon from "@mui/icons-material/CheckCircle";
// import RejectIcon from "@mui/icons-material/Cancel";
import styles from "./Outstanding.module.css";
// import { Pagination } from "react-bootstrap";
// import { useState } from "react";
// import { entries } from "lodash";

export default function PersonalOutstanding() {
  // const [active, setActive] = useState(1);
  // const items = [];
  // const entriesPerPage = 10;
  // const tabs = Math.ceil(props.data.length / entriesPerPage);

  // for (let number = 1; number <= tabs; number++) {
  //   items.push(
  //     <Pagination.Item
  //       key={number}
  //       active={number === active}
  //       onClick={() => setActive(number)}
  //     >
  //       {number}
  //     </Pagination.Item>
  //   );
  // }

  // const slicedData = props.data.slice(
  //   (active - 1) * entriesPerPage,
  //   active * entriesPerPage
  // );
  return (
    <>
      {/* <Row className="align-items-center pb-3">
        <Col xs="auto">
          {" "}
          <h2>Personal Trasactions</h2>
        </Col>
        <Col xs="auto"> </Col>
      </Row>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Transaction Name</th>
            <th>Amount($)</th>
            <th>Category</th>
            <th colSpan={3}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {slicedData.map((entry) => {
            return (
              <tr>
                <td>{new Date(entry.date).toDateString()}</td>
                <td>{entry.information}</td>
                <td>{Number(entry.amount).toFixed(2)}</td>
                <td>{entry.category}</td>
                <td>
                  <AcceptIcon style={{ color: "green" }} />
                </td>

                <td>
                  <RejectIcon style={{ color: "red" }} />
                </td>
                <td>
                  <EditIcon />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      <Pagination>{items}</Pagination> */}

      <p className={"p-5 " + styles.noGroupMessage}>
        You have no items that require classifications at the moment
      </p>
    </>
  );
}
