import { React, useContext } from "react";
import logo from "../../images/logo.png";
import imageAvatar from "../../images/img_avatar.png";
import AuthContext from "../../store/AuthContext";
// import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import {
  Nav,
  Navbar,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Tooltip,
  OverlayTrigger,
  Stack,
  Image,
} from "react-bootstrap";

function Navigator() {
  const authCtx = useContext(AuthContext);
  const navbar = { backgroundColor: "#64B5F6" };
  const renderAppName = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      TrackTogether
    </Tooltip>
  );

  const renderProfileTag = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Profile
    </Tooltip>
  );

  // const clientID = "00c74e4f-ce40-4652-be2a-05e632a5f82f";
  // const secret = "d06562dd-5d23-4e13-9646-76cc0d5ba5e0";
  // const redirectURL = "http://localhost:3000/Home";
  // const authURL = `/https://www.dbs.com/sandbox/api/sg/v1/oauth/authorize?
  // client_id=${clientID}&
  // redirect_uri=${redirectURL}&
  // scope=Read&
  // response_type=code`;

  // const profileURL = "/profile/" + authCtx.username;
  // const  goToBankAccount = (event) => {
  //   event.preventDefault();
  //   const navigation = useNavigate();
  //   navigation()

  // }

  return (
    <Navbar style={navbar} variant="light" expand="lg">
      <Container fluid>
        <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={renderAppName}
        >
          <Navbar.Brand href="/home">
            <img
              src={logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="TrackTogether"
            />
          </Navbar.Brand>
        </OverlayTrigger>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form className="d-flex">
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary">Search</Button>
          </Form>
        </Navbar.Collapse>

        <Stack direction="horizontal" gap={3}>
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 250, hide: 400 }}
            overlay={renderProfileTag}
          >
            <Link to="/profile">
              <Navbar.Text> Signed in as: {authCtx.username} </Navbar.Text>
            </Link>
          </OverlayTrigger>
          <Image
            src={authCtx.image ? authCtx.image : imageAvatar}
            roundedCircle
            width="50"
            height="50"
          />

          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown
              align="end"
              title="Settings"
              id="navbarScrollingDropdown"
            >
              <NavDropdown.Item href="/profile">Edit Profile</NavDropdown.Item>
              <NavDropdown.Item href="/bank-sync">
                Sync to Bank Account
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/profile">
                Delete Account
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Stack>
      </Container>
    </Navbar>
  );
}

export default Navigator;
