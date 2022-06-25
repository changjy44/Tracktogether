import React from "react";
import PersonalOutstanding from "./PersonalOutstanding";
import GroupOutstanding from "./GroupOutstanding";
import Alerts from "./Alerts";
import MonitorPayments from "./MonitorPayments";
import styles from "./Outstanding.module.css";
import {
  // Row,
  // Col,
  Tabs,
  Tab,
} from "react-bootstrap";
import Box from "../../components/Box";
function Outstanding() {
  return (
    <div className={styles.right}>
      <Box>
        <Tabs
          defaultActiveKey="Personal"
          id="uncontrolled-tab-example"
          className="mb-3"
        >
          <Tab eventKey="Personal" title="Personal">
            <PersonalOutstanding /*data={localData}*/ />
          </Tab>
          <Tab eventKey="Group" title="Group">
            <GroupOutstanding /*data={localData}*/ />
          </Tab>
          <Tab eventKey="Alerts" title="Payments Due">
            <Alerts /*data={localData}*/ />
          </Tab>
          <Tab eventKey="Monitor" title="Monitor Payments">
            <MonitorPayments /*data={localData}*/ />
          </Tab>
          {/* <Tab eventKey="AdjustmentLogs" title="Adjustment Logs">
                <AdjustmentLogs data={localData} />
              </Tab> */}
        </Tabs>
      </Box>
    </div>
  );
}

export default Outstanding;
