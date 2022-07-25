import React from "react";
import styles from "./Personal.module.css";
import {
  Button,
  Modal,
  Form,
  Stack,
  Row,
  Col,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import SearchIcon from "@mui/icons-material/Search";

function SubmitTransactionModal(props) {
  const formProps = props.formProps;
  const showValidationText = props.showValidationText;

  const isLoading = props.isLoading;
  const handleClassify = props.handleClassify;
  const handleCategoryInput = props.handleCategoryInput;
  const handleTransNameInput = props.handleTransNameInput;
  const currProgress = props.currProgress;
  const clickedClassify = props.clickedClassify;

  return (
    <Modal show={formProps.transactionForm} onHide={formProps.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Transaction</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              ref={formProps.dateInput}
              type="date"
              placeholder="Enter Date"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicTransaction">
            <Form.Label>Transaction name</Form.Label>
            <Row>
              <Col>
                <Form.Control
                  value={formProps.transNameInput}
                  onChange={handleTransNameInput}
                  placeholder="Enter transaction name"
                />
              </Col>
              <Col xs="auto">
                {isLoading ? (
                  <Spinner animation="border" />
                ) : (
                  <Button onClick={handleClassify}>
                    <SearchIcon />
                  </Button>
                )}
              </Col>
            </Row>
            <ProgressBar className="mt-2" now={currProgress} />
            <Form.Text>
              {" "}
              Click on the button to see the recommended category
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Category</Form.Label>
            {clickedClassify ? (
              <Form.Select
                value={formProps.categoryInput}
                onChange={handleCategoryInput}
                placeholder="Enter category"
              >
                <option> Food </option>
                <option> Travel </option>
                <option> Entertainment </option>
                <option> Grocery </option>
                <option> Utilities </option>
              </Form.Select>
            ) : (
              <Form.Control
                placeholder="Predicted category will be shown here"
                disabled
              />
            )}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicAmount">
            <Form.Label>Amount</Form.Label>
            <Form.Control
              ref={formProps.amountInput}
              type="number"
              placeholder="Enter amount"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicMode">
            <Form.Label>Transaction mode</Form.Label>
            <Form.Select
              ref={formProps.transModeInput}
              placeholder="Enter transaction mode"
            >
              <option> Bank </option>
              <option> PayLah </option>
              <option> Cash </option>
              <option> Others </option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Stack direction="horizontal" gap={3}>
          {showValidationText && (
            <label className={styles.warningText}> Date or Amount empty!</label>
          )}
          <Button variant="secondary" onClick={formProps.handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={formProps.handleAddTransaction}>
            Add Transaction
          </Button>
        </Stack>
      </Modal.Footer>
    </Modal>
  );
}

export default SubmitTransactionModal;
