import { Col } from "react-bootstrap";

export default function BankSync() {
  return (
    <Col>
      <h1>Incoming!</h1>
      <iframe
        src="https://internet-banking.dbs.com.sg/IB/Welcome"
        height={500}
        width={1000}
      ></iframe>
    </Col>
  );
}
