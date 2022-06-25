import React, { useState } from "react";

/* 
Sample data for use when testing components that depend on Filter Context
const currData = [
  {date: '2022-06-01', category: 'Food', amount: 4.5, information: 'Chicken Rice', mode: 'Cash'},
  {date: '2022-05-03', category: 'Food', amount: 3.3, information: 'Earlier Dinner', mode: 'Cash'},
  {date: '2022-06-30', category: 'Food', amount: 1.2, information: 'Later Chicken Rice', mode: 'Cash'},
  {date: '2022-03-31', category: 'Transport', amount: 40, information: 'Top Up Card', mode: 'Bank'},
  {date: '2021-11-02', category: 'Transport', amount: 30, information: 'Top Up Paylah', mode: 'Bank'}
]

const alertData = [
  {group: '27', user: 'Test', contact: 999, amount: -16.5, payeeHasPaid: false},
  {group: '27', user: 'Test', contact: 999, amount: -27.5, payeeHasPaid: false},
  {group: '27', user: 'Test', contact: 999, amount: -38.5, payeeHasPaid: false}
]

const adjustmentData = [
  {date: '2022-06-14T14:41:50.493Z', information: 'Group information not recorded', category: 'Food', amount: -26, mode: 'Groups'},
  {date: '2022-06-14T14:52:21.124Z', information: 'Group information not recorded', category: 'Food', amount: -82, mode: 'Groups'},
  {date: '2022-06-14T14:52:49.091Z', information: 'Group information not recorded', category: 'Food', amount: 25.43, mode: 'Groups'},
  {date: '2022-06-14T14:53:17.727Z', information: 'Group information not recorded', category: 'Food', amount: -66.67, mode: 'Groups'},
  {date: '2022-06-15T04:30:26.712Z', information: 'Group information not recorded', category: 'Food', amount: -20, mode: 'Groups'}
]

const propsFilterData = {
  currData: currData,
  alertData: alertData,
  adjustmentData: adjustmentData
}

<FilterContextProvider data={propsFilterData}> 

</FilterContextProvider>
*/

const FilterContext = React.createContext({
  optionState: [],
  isDataFetched: false,
  localData: null,
  setOptionState: () => {},
  addFilter: () => {},
  deleteFilter: () => {},
});

export const FilterContextProvider = (props) => {
  // const productionMode = typeof props.data === "undefined";

  const initialToken = localStorage.getItem("token") || props.token;

  const [optionState, setOptionState] = useState([]);

  // const [currData, setCurrData] = useState(
  //   productionMode ? [] : props.data.currData
  // );
  // const [localData, setLocalData] = useState(
  //   productionMode ? [] : props.data.currData
  // );

  // const [alertData, setAlertData] = useState(
  //   productionMode ? [] : props.data.alertData
  // );

  // const [adjustmentData, setAdjustmentData] = useState(
  //   productionMode ? [] : props.data.adjustmentData
  // );

  const [currData, setCurrData] = useState([]);
  const [localData, setLocalData] = useState([]);

  const [alertData, setAlertData] = useState([]);

  const [adjustmentData, setAdjustmentData] = useState([]);

  const [logState, setLogState] = useState(0); //0 is trans log, 1 is adjustment log, 2 is both.

  // const [dataFetched, setDataFetch] = useState(productionMode ? false : true);

  const [dataFetched, setDataFetch] = useState(false);

  function fetchAll() {
    const url = "http://localhost:8080/api/account/transactions/";
    console.log("fetching data in personal ");
    console.log("fetching txnData");
    const txnData = fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const newData = data.data;
        newData.forEach((entry) => {
          if (entry.information.trim() === "") {
            entry.information = "Transaction information not recorded";
          }
        });
        console.log("txnDataDone");
        return newData;
      })
      .catch((error) =>
        setCurrData(`Unable to retrieve quote. Error: ${error}`)
      );
    console.log("fetching alertData");
    const alertUrl = "http://localhost:8080/api/account/alerts/";
    const alertData = fetch(alertUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("alertDatadone");
        return data.data.pending;
      })
      .catch((error) =>
        setCurrData(`Unable to retrieve quote. Error: ${error}`)
      );
    console.log("fetching adjustmentData");
    const adjustmentUrl = "http://localhost:8080/api/account/adjustment/";
    const adjustmentData = fetch(adjustmentUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + initialToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const adjustments = data.data.adjustments.map((entry) => {
          const newInfo =
            entry.description.trim() === ""
              ? "Group information not recorded"
              : entry.description;
          const newMode = "Groups";
          const json = {
            date: entry.date,
            information: newInfo,
            category: entry.category,
            amount: entry.amount,
            mode: newMode,
            groupID: entry.groupID,
          };
          return json;
        });
        console.log("adjustmentDatadone");
        return adjustments;
      })
      .catch((error) =>
        setCurrData(`Unable to retrieve quote. Error: ${error}`)
      );

    Promise.all([txnData, alertData, adjustmentData])
      .then((arrayOfData) => {
        // console.log(arrayOfData);
        // console.log("arrayOfData");
        const newCurrData = [...arrayOfData[0]];
        const newAlerts = [...arrayOfData[1]];
        const newAdjustmentData = [...arrayOfData[2]];
        setCurrData(newCurrData);
        setLocalData(newCurrData);
        setAlertData(newAlerts);
        setAdjustmentData(newAdjustmentData);
        setDataFetch(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!dataFetched && initialToken != null) {
    fetchAll();
  }
  const addFilter = () => {
    const newState = [
      ...optionState,
      {
        filterVariable: "Date",
        dateYear: "All",
        dateMonth: "All",
        category: "All",
        lowerAmount: "",
        upperAmount: "",
        transactionMode: "",
        filterIndividual: () => {},
      },
    ];
    setOptionState(newState);
  };

  const deleteAllFilter = () => {
    setOptionState([]);
  };

  const changeFilterVariable = (index, newFilter) => {
    const newState = [...optionState];
    newState[index].filterVariable = newFilter;
    setOptionState(newState);
  };

  const changeYear = (index, newYear) => {
    const newState = [...optionState];
    newState[index].dateYear = newYear;
    setOptionState(newState);
  };

  const changeMonth = (index, newMonth) => {
    const newState = [...optionState];
    newState[index].dateMonth = newMonth;
    setOptionState(newState);
  };

  const changeCategory = (index, newCategory) => {
    const newState = [...optionState];
    newState[index].category = newCategory;
    setOptionState(newState);
  };

  const changeLowerAmount = (index, newLowerAmount) => {
    const newState = [...optionState];
    newState[index].lowerAmount = newLowerAmount;
    setOptionState(newState);
  };

  const changeUpperAmount = (index, newUpperAmount) => {
    const newState = [...optionState];
    newState[index].upperAmount = newUpperAmount;
    setOptionState(newState);
  };

  const changeTransactionMode = (index, newMode) => {
    const newState = [...optionState];
    newState[index].transactionMode = newMode;
    setOptionState(newState);
  };

  const changeFilterIndividual = (index, newFilterFunction) => {
    const newState = [...optionState];
    newState[index].filterIndividual = newFilterFunction;
    setOptionState(newState);
  };

  const filterAll = (logType) => {
    let dataStream =
      logType === 0
        ? currData
        : logType === 1
        ? adjustmentData
        : currData.concat(adjustmentData);
    for (let i = 0; i < optionState.length; i++) {
      dataStream = optionState[i].filterIndividual(dataStream);
    }
    return dataStream;
  };

  const refresh = (index) => {
    changeYear(index, "All");
    changeMonth(index, "All");
    changeCategory(index, "All");
    changeLowerAmount(index, "");
    changeUpperAmount(index, "");
    changeTransactionMode(index, "All");
  };

  const logoutHandler = () => {
    setDataFetch(false);
    setOptionState([]);
    setCurrData([]);
    setLocalData([]);
    setAlertData([]);
    setAdjustmentData([]);
    setLogState(0);
  };

  const contextValue = {
    isDataFetched: dataFetched,
    optionState: optionState,
    currData: currData,
    alertData: alertData,
    adjustmentData: adjustmentData,
    logState: logState,
    setLogState: setLogState,
    setOptionState: setOptionState,
    setCurrData: setCurrData,
    localData: localData,
    setLocalData: setLocalData,
    addFilter: addFilter,
    deleteAllFilter: deleteAllFilter,
    changeFilterVariable: changeFilterVariable,
    changeYear: changeYear,
    changeMonth: changeMonth,
    changeCategory: changeCategory,
    changeLowerAmount: changeLowerAmount,
    changeUpperAmount: changeUpperAmount,
    changeTransactionMode: changeTransactionMode,
    changeFilterIndividual: changeFilterIndividual,
    filterAll: filterAll,
    refresh: refresh,
    logout: logoutHandler,
    setDataFetch: setDataFetch,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {props.children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
