//import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Box from "../../components/Box";
import styles from "./Groups.module.css";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../store/AuthContext";
import GroupContext from "../../store/GroupContext";
import imageAvatar from "../../images/img_avatar.png";
import AddGroupModal from "./AddGroupModal";
import {
  // Table,
  Stack,
  Button,
  Form,
  Row,
  Col,
  Card,
  Image,
  Popover,
  OverlayTrigger,
  Spinner,
} from "react-bootstrap";
import PageLoading from "../../components/Loading/PageLoading";

function Group() {
  const authCtx = useContext(AuthContext);
  const groupCtx = useContext(GroupContext);
  const navigate = useNavigate();

  // const [groups, setGroups] = useState([]);
  const groups = groupCtx.group;
  const setGroups = groupCtx.setGroup;
  const [groupToJoin, setGroupToJoin] = useState(null);
  const [joinErrorMessage, setJoinErrorMessage] = useState("");

  function childToParent(childdata) {
    const newGroups = [...groups];
    newGroups.push(childdata);
    setGroups(newGroups);
  }

  function handleJoin() {
    if (groupToJoin) {
      if (groupCtx.validateGroupWithID(parseInt(groupToJoin))) {
        setJoinErrorMessage("You are already in the group");
      } else {
        const url = global.baseURL + "/api/group/join";
        setJoinLoading(true);
        fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            groupID: parseInt(groupToJoin),
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
                console.log(data.message);
                setJoinErrorMessage(data.message);
                setJoinLoading(false);
              });
            }
          })
          .then((data) => {
            const newGroups = [...groups];
            newGroups.push(data.data.group);
            setJoinLoading(false);
            setGroups(newGroups);
          });
        // .catch((err) => {
        //   alert(err.message);
        // });
      }
    }
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Please Try Again!</Popover.Header>
      <Popover.Body>
        <div>
          <strong>{joinErrorMessage}</strong>
        </div>
        <div class="form-row text-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setJoinErrorMessage("")}
          >
            Close
          </Button>
        </div>
      </Popover.Body>
    </Popover>
  );

  useEffect(() => setGroups(groupCtx.group), [groupCtx]);

  function truncateName(name) {
    if (name.length > 12) {
      return name.slice(0, 9) + "...";
    } else {
      return name;
    }
  }

  function padWithZeroes(groupID) {
    let groupIDString = groupID.toString();
    for (let i = 0; i < 4 - groupID.toString().length; i++) {
      groupIDString = "0" + groupIDString;
    }
    return groupIDString;
  }

  const [addGroupForm, setAddGroupForm] = useState(false);

  const handleClose = () => setAddGroupForm(false);
  const handleAddGroupForm = () => setAddGroupForm(true);

  const formProps = {
    addGroupForm: addGroupForm,
    handleClose: handleClose,
  };
  const [joinLoading, setJoinLoading] = useState(false);
  return groupCtx.isDataFetched ? (
    <div className={styles.right}>
      <Box>
        <Row className="align-items-center pb-3">
          <Col xs="auto">
            <h2> Groups</h2>
          </Col>
        </Row>
        <Row className="align-items-center pb-3">
          <Col xs="4">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              onChange={(e) => setGroupToJoin(e.target.value)}
            />
          </Col>
          <Col xs="auto">
            <OverlayTrigger
              show={joinErrorMessage}
              placement="right"
              overlay={popover}
            >
              {joinLoading ? (
                <Button>
                  Joining
                  <Spinner
                    className="mx-2 py-1"
                    animation="border"
                    as="span"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </Button>
              ) : (
                <Button onClick={handleJoin}>Join</Button>
              )}
            </OverlayTrigger>
          </Col>
          <Col xs="auto">
            <Button onClick={handleAddGroupForm}>Create</Button>
          </Col>
        </Row>
        <Row xs={1} sm={2} xl={4} xxl={6} className="g-4">
          {groups.length == 0 && (
            <p className={"p-5 " + styles.noGroupMessage}>
              You have not joined any groups
            </p>
          )}
          {groups.map((entry) => {
            return (
              <Col>
                <Card
                  className={styles.groupCard + " m-5"}
                  role="card"
                  onClick={() => {
                    navigate("./" + entry.groupID);
                  }}
                >
                  <Card.Body>
                    <Stack>
                      <Image
                        src={
                          groupCtx.findImageWithID(entry.groupID)
                            ? groupCtx.findImageWithID(entry.groupID)
                            : imageAvatar
                        }
                        roundedCircle
                        width="75"
                        height="75"
                        className={styles.groupImage + " mb-3"}
                      />

                      <h4> {truncateName(entry.name)}</h4>
                      <p className="mb-0"> {padWithZeroes(entry.groupID)}</p>
                    </Stack>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Box>
      <AddGroupModal formProps={formProps} childToParent={childToParent} />
    </div>
  ) : (
    <div className={styles.right}>
      <Box>
        <PageLoading />
      </Box>
    </div>
  );
}

export default Group;
