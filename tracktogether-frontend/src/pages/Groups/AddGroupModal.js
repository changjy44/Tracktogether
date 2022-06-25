import React, { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import AuthContext from "../../store/AuthContext";

function AddGroupModal(props) {
  const formProps = props.formProps;

  const authCtx = useContext(AuthContext);

  const [groupName, setGroupName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const url = "http://localhost:8080/api/group/";
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        name: groupName,
        _id: authCtx._id,
        username: authCtx.username,
        contact: authCtx.contact,
      }),
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
            let errorMessage = "Authentication failed!";
            console.log(JSON.stringify(data));
            if (data && data.error && data.error.message) {
              errorMessage = data.error.message;
            }
            console.log(errorMessage);

            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        formProps.handleClose();
        props.childToParent(data.data.group);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <Modal show={formProps.addGroupForm} onHide={formProps.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Group</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicname">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            placeholder="Enter Name"
            onChange={(e) => setGroupName(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Create group</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddGroupModal;
