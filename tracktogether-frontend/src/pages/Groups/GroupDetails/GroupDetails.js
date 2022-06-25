//import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Box from "../../../components/Box";
import PaymentForm from "./GroupComponents/PaymentForm";
import GroupMemberList from "./GroupComponents/GroupMemberList";
import GroupSettings from "./GroupComponents/GroupSettings";
import GroupLogs from "./GroupComponents/GroupLog";
import styles from "../Groups.module.css";
import React, { useContext } from "react";
import AuthContext from "../../../store/AuthContext";
import GroupContext from "../../../store/GroupContext";
import { useParams } from "react-router-dom";
import {
  Tabs,
  Tab,
  // Table,
  // Stack,
  // Button,
  // Form,
  // Row,
  // Col,
  // Card,
  // Image,
  // Popover,
  // OverlayTrigger,
} from "react-bootstrap";

function GroupDetails() {
  const authCtx = useContext(AuthContext);
  console.log(authCtx);
  const grpCtx = useContext(GroupContext);
  //Use this to find the specific route of the group
  const params = useParams();

  return grpCtx.validateGroupWithID(parseInt(params.groupID)) ? (
    <div className={styles.right}>
      <Box>
        <Tabs
          defaultActiveKey="payment"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="payment" title="Initiate Payment">
            <PaymentForm />
          </Tab>
          <Tab eventKey="memberList" title="Member List">
            <GroupMemberList />
          </Tab>
          <Tab eventKey="groupSettings" title="Group Settings">
            <GroupSettings />
          </Tab>
          <Tab eventKey="groupLogs" title="Group Logs">
            <GroupLogs />
          </Tab>
        </Tabs>
      </Box>
    </div>
  ) : (
    <div>
      <h1>Error 404 not found</h1>
    </div>
  );
}

export default GroupDetails;
