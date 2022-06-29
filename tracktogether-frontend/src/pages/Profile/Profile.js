import AuthContext from "../../store/AuthContext";
import imageAvatar from "../../images/img_avatar.png";
import Box from "../../components/Box";
import styles from "./Profile.module.css";
import React, { useState, useContext, useRef, useEffect } from "react";
import { Form, Row, Col, Button, Image, Stack, Spinner } from "react-bootstrap";
// import EditIcon from "@mui/icons-material/Edit";
// import CameraAltIcon from "@mui/icons-material/CameraAlt";
// import { useNavigate } from "react-router-dom";

function Profile() {
  const authCtx = useContext(AuthContext);
  // const navigation = useNavigate();

  const [username, setUserName] = useState(authCtx.username);
  const [contact, setContact] = useState(authCtx.contact);
  const [email, setEmail] = useState(authCtx.email);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUserName(authCtx.username);
    setContact(authCtx.contact);
    setEmail(authCtx.email);
  }, [authCtx]);
  // const [image, setImage] = useState(authCtx.image);

  // const [imageName, setImageName] = useState(null);
  const inputRef = useRef(null);

  const [formState, setFormState] = useState(true);

  const handleEditableState = () => {
    setFormState(false);
  };

  function handleSubmit(event) {
    event.preventDefault();
    const validateEmail = (email) => {
      return String(email)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    if (email.trim() === "" || contact.toString().trim() === "") {
      setShowWarning(true);
      setShowWarningText("Contact number or Email cannot be empty!");
      return;
    }

    if (!validateEmail(email)) {
      setShowWarning(true);
      setShowWarningText("Please enter a valid email!");
      return;
    }
    if (contact.length != 8) {
      setShowWarning(true);
      setShowWarningText("Please enter 8 digits for contact number!");
      return;
    }

    const url = global.baseURL + "/api/account/";
    setEditProfileLoading(true);
    fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        _id: authCtx.id,
        username: username,
        email: email,
        contact: contact,
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
      .then(() => {
        setEditProfileLoading(false); //might not need tho
        location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  const handleUpload = (event) => {
    event.preventDefault();
    // setImage(URL.createObjectURL(inputRef.current.files[0]));
    const formData = new FormData();
    formData.append("id", authCtx.id);
    formData.append("image", event.target.files[0]);
    console.log(formData);

    setLoading(true);

    const url = global.baseURL + "/api/account/upload";
    fetch(url, {
      method: "PUT",
      body: formData,
      headers: {
        // "Content-Type": "multipart/form-data",
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
    setLoading(true);
    const url = global.baseURL + "/api/account/remove";
    fetch(url, {
      method: "DELETE",
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

  const [showWarning, setShowWarning] = useState(false);
  const [warningText, setShowWarningText] = useState("");
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  return (
    <div className={styles.right}>
      <Box>
        <h2 className={styles.header + " pb-3"}>Your Profile</h2>
        <Row>
          <Col xs="auto">
            {" "}
            <div>
              <Image
                className="m-3"
                src={authCtx.image ? authCtx.image : imageAvatar}
                roundedCircle
                width="250"
                height="250"
              />{" "}
              <div className="m-3 d-flex align-items-center">
                {loading ? (
                  <div style={{ paddingLeft: 100 }}>
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </Col>
          <Col xl={6} sm={12}>
            <Form>
              <Row className="mb-3">
                <Col xs="auto">
                  <Form.Group controlId="profileName">
                    <Form.Label className="text-start">Name</Form.Label>
                    <Form.Control
                      disabled
                      placeholder="Enter Name"
                      value={username}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs="auto">
                  <Form.Group controlId="profileBank">
                    <Form.Label className="text-start"> Bank</Form.Label>
                    <Form.Control disabled placeholder="Bank Name" />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="auto">
                  <Form.Group controlId="profileContact">
                    <Form.Label className="text-start">
                      Contact Number
                    </Form.Label>
                    <Form.Control
                      disabled={formState}
                      placeholder="Enter Contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  </Form.Group>
                </Col>

                <Col xs="auto">
                  <Form.Group controlId="profileAccNumber">
                    <Form.Label className="text-start">
                      Account Number
                    </Form.Label>
                    <Form.Control disabled placeholder="Acc Num" />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs="auto">
                  <Form.Group controlId="profileEmail">
                    <Form.Label className="text-start">Email</Form.Label>
                    <Form.Control
                      disabled={formState}
                      placeholder="Enter Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Stack direction="horizontal" gap={3}>
                {editProfileLoading ? (
                  <Button variant="primary">
                    Submitting
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
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                )}

                <Button onClick={handleEditableState}>Edit Profile</Button>
              </Stack>
            </Form>

            <Stack direction="horizontal" gap={3} className="pb-3">
              <Button className="mt-3" disabled>
                {" "}
                Change Password
              </Button>
              <Button variant="danger" className="mt-3" disabled>
                Delete Account{" "}
              </Button>
            </Stack>
            {showWarning && <p className={styles.warning}> {warningText} </p>}
          </Col>
        </Row>
      </Box>
    </div>
  );
}

export default Profile;
