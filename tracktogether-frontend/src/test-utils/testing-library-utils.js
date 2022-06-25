import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextProvider } from "../store/AuthContext";
import { FilterContextProvider } from "../store/FilterContext";
import { GroupContextProvider } from "../store/GroupContext";
// const propsAuthData = require("../store/AuthDummyContext.json");
// const propsFilterData = require("../store/FilterDummyContext.json");
// const propsGroupData = require("../store/GroupDummyContext.json");
import { createMemoryHistory } from "history";

const authToken = process.env.REACT_APP_AUTH_TOKEN;

const customRender = (ui, routeHistory, initialRouteIndex, options) => {
  const history = createMemoryHistory({
    initialEntries: routeHistory,
    initialIndex: initialRouteIndex,
  });
  const AllTheProviders = ({ children }) => {
    return (
      <AuthContextProvider token={authToken}>
        <FilterContextProvider token={authToken}>
          <GroupContextProvider token={authToken}> 
            <Router history={history}>{children}</Router>
          </GroupContextProvider>
         </FilterContextProvider>
       </AuthContextProvider>
    );
  };
  const component = render(ui, { wrapper: AllTheProviders, ...options });
  return {...component, history};
};

// re-export everything
export * from "@testing-library/react";

// override render method
export { customRender as render };
