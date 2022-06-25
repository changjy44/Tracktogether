import { React, useContext } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  // CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink } from "react-router-dom";
import AuthContext from "../../store/AuthContext";
import { matchPath } from "react-router";
import { useLocation } from "react-router-dom";
import GroupContext from "../../store/GroupContext";
import FilterContext from "../../store/FilterContext";

function SideNavigator() {
  const authCtx = useContext(AuthContext);
  const groupCtx = useContext(GroupContext);
  const filterCtx = useContext(FilterContext);
  const location = useLocation();

  function handleLogout(e) {
    e.preventDefault();
    authCtx.logout();
    filterCtx.logout();
    groupCtx.logout();
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        overflow: "auto",
      }}
    >
      <CDBSidebar textColor="#fff" backgroundColor="#333">
        <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
          <a
            href="/"
            className="text-decoration-none"
            style={{ color: "inherit" }}
          >
            TrackTogether
          </a>
        </CDBSidebarHeader>

        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink exact to="/home">
              <CDBSidebarMenuItem
                icon="home"
                active={matchPath(location.pathname, "/home")}
              >
                {" "}
                Home
              </CDBSidebarMenuItem>
            </NavLink>

            <NavLink exact to="/personal">
              <CDBSidebarMenuItem
                icon="user"
                active={matchPath(location.pathname, "/personal")}
              >
                Personal
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/groups" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                icon="users"
                active={
                  matchPath(location.pathname, "/groups") ||
                  matchPath({ path: "/groups/:groupID" }, location.pathname)
                }
              >
                Groups
              </CDBSidebarMenuItem>
            </NavLink>
            <NavLink exact to="/outstanding" activeClassName="activeClicked">
              <CDBSidebarMenuItem
                icon="hand-holding-usd"
                active={matchPath(location.pathname, "/outstanding")}
              >
                Outstanding
              </CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>{" "}
          <hr />
          <NavLink
            exact
            to="/"
            activeClassName="activeClicked"
            onClick={handleLogout}
          >
            <CDBSidebarMenuItem icon="sign-out-alt">Logout</CDBSidebarMenuItem>
          </NavLink>
        </CDBSidebarContent>

        {/* <CDBSidebarFooter>

        </CDBSidebarFooter> */}
      </CDBSidebar>
    </div>
  );
}

export default SideNavigator;
