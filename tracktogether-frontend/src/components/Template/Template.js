import React from "react";
import Navigator from "../navbar/Navigator";
import SideNavigator from "../sidebar/SideNavigator";
import styles from "./Template.module.css";

function Template(props) {
  const { children } = props;

  return (
    <React.Fragment style={{ overflow: "auto" }}>
      <Navigator />
      <div style={{ display: "flex", minHeight: "100%", overflow: "auto" }}>
        <div className={styles.left}>
          <SideNavigator />
        </div>

        {children}
      </div>
    </React.Fragment>
  );
}

export default Template;
