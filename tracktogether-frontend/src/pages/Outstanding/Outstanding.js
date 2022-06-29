import React, { useContext } from "react";
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
import FilterContext from "../../store/FilterContext";
import PageLoading from "../../components/Loading/PageLoading";

function Outstanding() {
  const filterCtx = useContext(FilterContext);
  return filterCtx.isDataFetched ? (
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
          <Tab eventKey="Group" title="Notifications">
            <GroupOutstanding /*data={localData}*/ />
          </Tab>
          <Tab eventKey="Alerts" title="Alerts">
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
  ) : (
    <div className={styles.right}>
      <Box>
        <PageLoading />
      </Box>
    </div>
  );
}

export default Outstanding;
