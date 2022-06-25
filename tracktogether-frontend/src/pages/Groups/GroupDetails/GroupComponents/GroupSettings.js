import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./GroupComponent.module.css";
import imageAvatar from "../../../../images/img_avatar.png";
import AuthContext from "../../../../store/AuthContext";
import GroupContext from "../../../../store/GroupContext";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
import {
  //   Tabs,
  //   Tab,
  // Table,
  //   Stack,
  Button,
  Image,
  Form,
  Row,
  Col,
  Modal,
  //   ListGroup,
  //   CloseButton,
  //   Container,
  // Card,
  // Image,
  // Popover,
  // OverlayTrigger,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

function GroupSettings() {
  const navigation = useNavigate();
  const initialToken = localStorage.getItem("token");
  const authCtx = useContext(AuthContext);
  const grpCtx = useContext(GroupContext);
  console.log(authCtx);
  const groupID = parseInt(useParams().groupID);

  const groupImageString = grpCtx.findImageWithID(groupID);
  const groupInformation = grpCtx.findGroupWithID(groupID);

  const [deleteShow, setDeleteShow] = useState(false);
  const [leaveShow, setLeaveShow] = useState(false);

  const [groupImage, setGroupImage] = useState(groupImageString);
  const [currGroupName, setCurrGroupName] = useState(groupInformation.name);

  const [showUpdatedMessage, setShowUpdatedMessage] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    console.log("groupCtx has changed!");

    const groupInformation = grpCtx.findGroupWithID(groupID);
    const groupImageString = grpCtx.findImageWithID(groupID);
    // console.log(groupInformation);
    console.log(groupImageString);
    setCurrGroupName(groupInformation.name);
    setGroupImage(groupImageString);
  }, [grpCtx]);

  // console.log(setCurrGroupName);

  function handleOpen(name) {
    return () => {
      name == "delete" ? setDeleteShow(true) : setLeaveShow(true);
    };
  }

  function handleClose(name) {
    return () => {
      name == "delete" ? setDeleteShow(false) : setLeaveShow(false);
    };
  }

  function handleChangeGroupDetails() {
    const url = "http://localhost:8080/api/group/";
    fetch(url, {
      method: "PUT",
      // body: JSON.stringify(base),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
      body: JSON.stringify({
        groupID: groupID,
        name: currGroupName,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(res.json().data.message);
        }
      })
      .then((data) => {
        const newGroupData = data.data.group;
        const groupName = newGroupData.name;
        grpCtx.updateGroupWithID(groupID, groupName);
        setShowUpdatedMessage(true);
        console.log("Group name updated successfully");
      });
  }

  function handleDeleteGroup() {
    const url = "http://localhost:8080/api/group/delete-group";
    fetch(url, {
      method: "PUT",
      // body: JSON.stringify(base),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
      body: JSON.stringify({
        groupID: groupID,
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
        grpCtx.deleteGroupWithID(groupID);
        console.log("Group deleted successfully");
      });
    navigation(-1);
  }

  function handleLeaveGroup() {
    const amountOwed = findAmountWithUsername(authCtx.username);

    if (amountOwed !== 0) {
      setShowWarning(true);
      return;
    }

    const url = "http://localhost:8080/api/group/delete-member";
    fetch(url, {
      method: "PUT",
      // body: JSON.stringify(base),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
      body: JSON.stringify({
        groupID: groupID,
        username: authCtx.username,
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
        grpCtx.deleteGroupWithID(groupID);
        console.log("Successfully left the group");
      });
    navigation(-1);
  }

  const handleUpload = (event) => {
    event.preventDefault();
    const imageData = new FormData();
    imageData.append("groupID", groupID);
    imageData.append("image", event.target.files[0]);
    console.log(imageData);
    fetch("http://localhost:8080/api/group/upload", {
      method: "PUT",
      body: imageData,
      headers: {
        authorization: "Bearer " + authCtx.token,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            let errorMessage;
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
        console.log(data.data.account);
        location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const handleRemove = (event) => {
    event.preventDefault();
    fetch("http://localhost:8080/api/group/remove", {
      method: "DELETE",
      body: JSON.stringify({
        groupID: groupID,
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
            let errorMessage;
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
        console.log(data.data.account);
        location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  function findAmountWithUsername(username) {
    let amount = null;
    groupInformation.users.forEach((user) => {
      if (user.username === username) {
        amount = user.amount;
      }
    });

    return amount;
  }

  const [showWarning, setShowWarning] = useState(false);

  // console.log(groupInformation);
  // console.log(currGroupName + " is the currgrpname");

  return (
    <div className={styles.newApp}>
      <Row>
        <Col xs="auto">
          <h2 className={styles.header + " mb-0"}>Group Settings</h2>{" "}
        </Col>
      </Row>

      <Image
        className="m-3"
        src={groupImage ? groupImage : imageAvatar}
        roundedCircle
        width="250"
        height="250"
      />
      <div className="m-3 d-flex align-items-center">
        <input
          ref={inputRef}
          onChange={handleUpload}
          className="d-none"
          type="file"
          accept="image/*"
        />
        <div style={{ paddingLeft: 30 }}>
          <Button
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Upload
          </Button>
        </div>
        <div style={{ paddingLeft: 30 }}>
          <Button variant="danger" onClick={handleRemove}>
            Remove
          </Button>
        </div>
      </div>
      <Row className="my-4">
        <Col xs="auto">
          <h5 className={styles.header}>Name</h5>
        </Col>
        <Col xs="auto">
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  value={currGroupName}
                  // placeholder={groupName}
                  onChange={(e) => setCurrGroupName(e.target.value)}
                ></Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Button onClick={handleChangeGroupDetails}> Save Changes</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {showUpdatedMessage && (
        <strong>
          {" "}
          <p style={{ color: "green" }}> Group Updated Successfully!</p>{" "}
        </strong>
      )}
      <Row>
        {/* <Col xs="auto"></Col> */}
        <Col xs="auto">
          <Button variant="danger" onClick={handleOpen("delete")}>
            {" "}
            Delete Group{" "}
          </Button>
          <Modal show={deleteShow} onHide={handleClose("delete")}>
            <Modal.Body>
              <strong>Are you sure you want to delete the group?</strong>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose("delete")}>
                Close
              </Button>
              <Button variant="danger" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
        <Col xs="auto">
          <Button variant="danger" onClick={handleOpen("leave")}>
            {" "}
            Leave Group{" "}
          </Button>
          <Modal show={leaveShow} onHide={handleClose("leave")}>
            <Modal.Body>
              <strong>Are you sure you want to leave the group?</strong>
              {showWarning && (
                <label className="py-3" style={{ color: "red" }}>
                  {" "}
                  You still have outstanding money!
                </label>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose("leave")}>
                Close
              </Button>
              <Button variant="danger" onClick={handleLeaveGroup}>
                Leave
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </div>
  );
}

export default GroupSettings;
