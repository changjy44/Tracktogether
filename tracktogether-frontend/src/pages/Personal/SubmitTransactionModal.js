import React from "react";
import styles from "./Personal.module.css";
import { Button, Modal, Form, Stack } from "react-bootstrap";

function SubmitTransactionModal(props) {
  const formProps = props.formProps;
  const showValidationText = props.showValidationText;

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
            <Form.Control
              ref={formProps.transNameInput}
              placeholder="Enter transaction name"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCategory">
            <Form.Label>Category</Form.Label>
            <Form.Select
              ref={formProps.categoryInput}
              placeholder="Enter category"
            >
              <option> Food </option>
              <option> Transport </option>
              <option> Bills </option>
              <option> Others</option>
            </Form.Select>
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
