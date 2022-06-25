// import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Home from "./pages/Home";
import Personal from "./pages/Personal/";
import Profile from "./pages/Profile/";
import Groups from "./pages/Groups/";
import GroupDetails from "./pages/Groups/GroupDetails";
import Outstanding from "./pages/Outstanding/";
import Bank from "./pages/Bank/";
import AuthContext from "./store/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import "./App.css";
import { FilterContextProvider } from "./store/FilterContext";
import { GroupContextProvider } from "./store/GroupContext";

function App() {
  const authCtx = useContext(AuthContext);
  // const profileURL = "/profile/" + authCtx.username;
  return (
    <div className="App">
      <GroupContextProvider>
        <FilterContextProvider>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            {authCtx.isLoggedIn && <Route path="/Home" element={<Home />} />}

            {authCtx.isLoggedIn && (
              <Route path="/personal" element={<Personal />} />
            )}

            {authCtx.isLoggedIn && (
              <Route path="/profile" element={<Profile />} />
            )}
            {authCtx.isLoggedIn && (
              <Route path="/groups" element={<Groups />} />
            )}
            {authCtx.isLoggedIn && (
              <Route path="/groups/:groupID" element={<GroupDetails />} />
            )}
            {authCtx.isLoggedIn && (
              <Route path="/outstanding" element={<Outstanding />} />
            )}

            {authCtx.isLoggedIn && (
              <Route path="/bank-sync" element={<Bank />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </FilterContextProvider>
      </GroupContextProvider>
    </div>
  );
}

export default App;
