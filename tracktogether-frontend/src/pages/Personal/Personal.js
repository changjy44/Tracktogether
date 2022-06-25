import Box from "../../components/Box";
import SubmitTransactionModal from "./SubmitTransactionModal";
import styles from "./Personal.module.css";
import React, { useState, useRef, useContext, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
// import AuthContext from "../../store/AuthContext";
import FilterContext from "../../store/FilterContext";
import FilterComponent from "./FilterComponent";
import {
  Table,
  Stack,
  Button,
  Form,
  Row,
  Col,
  // Container,
  Popover,
  OverlayTrigger,
  Pagination,
} from "react-bootstrap";

function Personal() {
  const token = localStorage.getItem("token");
  const filterCtx = useContext(FilterContext);
  const currData = filterCtx.currData;
  const localData = filterCtx.localData;
  const setLocalData = filterCtx.setLocalData;

  const [totalAmount, setTotalAmount] = useState(
    localData.reduce((curr, next) => curr + next.amount, 0).toFixed(2)
  );

  useEffect(() => {
    setTotalAmount(
      filterCtx.localData
        .reduce((curr, next) => curr + next.amount, 0)
        .toFixed(2)
    );
  }, [filterCtx]);

  const [sortCategory, setSortCategory] = useState("Date");
  const [sortDirection, setSortDirection] = useState(true); //True implies descending order
  const handleSortDirection = () => {
    setSortDirection(!sortDirection);
    sortCategoryHandler(sortCategory, !sortDirection);
  };

  function sortCategoryHandler(sortCategory, sortDirection) {
    function dataComparator(sortCategoryValue) {
      const numericalSortDirection = sortDirection ? 1 : -1;
      switch (sortCategoryValue) {
        case "Date":
          return (a, b) =>
            numericalSortDirection * (new Date(b.date) - new Date(a.date));
        case "Amount":
          return (a, b) =>
            numericalSortDirection * (Number(b.amount) - Number(a.amount));
        case "Transaction Name":
          return (a, b) =>
            numericalSortDirection * (b.information < a.information ? -1 : 1);
      }
    }

    const newLocalData = [...localData];
    newLocalData.sort(dataComparator(sortCategory));
    setLocalData(newLocalData);
  }

  function sortStream(data, sortCategory, sortDirection) {
    function dataComparator(sortCategoryValue) {
      const numericalSortDirection = sortDirection ? 1 : -1;
      switch (sortCategoryValue) {
        case "Date":
          return (a, b) =>
            numericalSortDirection * (new Date(b.date) - new Date(a.date));
        case "Amount":
          return (a, b) =>
            numericalSortDirection * (Number(b.amount) - Number(a.amount));
        case "Transaction Name":
          return (a, b) =>
            numericalSortDirection * (b.information < a.information ? -1 : 1);
      }
    }
    const newLocalData = [...data];
    newLocalData.sort(dataComparator(sortCategory));
    return newLocalData;
  }

  const dataToDisplay = sortStream(localData, sortCategory, sortDirection);

  // sortCategoryHandler();

  // filterCtx.setLocalDataFunction(setLocalData);
  // filterCtx.setSortCategoryHandlerFunction(sortCategoryHandler);

  const dateInput = useRef();
  const transNameInput = useRef();
  const categoryInput = useRef();
  const amountInput = useRef();
  const transModeInput = useRef();

  const [transactionForm, setTransactionForm] = useState(false);
  const handleClose = () => setTransactionForm(false);
  const handleTransactionForm = () => setTransactionForm(true);
  const handleAddTransaction = () => {
    const enteredDate = dateInput.current.value;
    const enteredTransName = transNameInput.current.value;
    const enteredCategory = categoryInput.current.value;
    const enteredAmount = amountInput.current.value;
    const enteredTransMode = transModeInput.current.value;
    const newData = {
      date: enteredDate,
      category: enteredCategory,
      amount: parseFloat(enteredAmount),
      information: enteredTransName,
      mode: enteredTransMode,
    };
    console.log(newData);
    if (enteredDate === "" || enteredAmount === "") {
      setShowValidationText(true);
      return;
    }

    setTransactionForm(false);
    const url = "http://localhost:8080/api/account/transactions/";
    console.log(url);
    fetch(url, {
      method: "PUT",
      body: JSON.stringify({
        data: newData,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
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
      .then(() => {
        // setCurrData([...currData, newData]);
        // setLocalData([...localData, newData]);
        location.reload();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const [filterArray, setFilterArray] = useState([]);

  const addFilterHandler = () => {
    filterCtx.addFilter();
    setFilterArray([
      ...filterArray,
      {
        displayComponent: (
          <FilterComponent
            index={filterArray.length}
            localData={localData}
            setLocalData={setLocalData}
            setActiveTab={setActiveTab}
          />
        ),
      },
    ]);
  };
  const removeFilterHandler = () => {
    filterCtx.deleteAllFilter();
    setFilterArray([]);
    setLocalData(currData);
  };

  const popover = () => {
    return (
      <Popover id="popover-basic">
        <Popover.Header>Filter By</Popover.Header>
        {filterArray.map((entry) => entry.displayComponent)}
        <Popover.Body>
          {" "}
          <Stack direction="horizontal" gap={3}>
            <Button
              className="ms-auto"
              variant="secondary"
              onClick={removeFilterHandler}
            >
              Clear all
            </Button>
            <Button aria-label="addfilter" onClick={addFilterHandler}>
              {" "}
              <AddIcon />
            </Button>
          </Stack>
        </Popover.Body>
      </Popover>
    );
  };

  const [activeTab, setActiveTab] = useState(1);
  let items = [];
  const numberOfEntries = localData.length;
  const entriesPerPage = 15;
  const tabs = Math.ceil(numberOfEntries / entriesPerPage);
  for (let number = 1; number <= tabs; number++) {
    items.push(
      <Pagination.Item
        key={number}
        onClick={() => setActiveTab(number)}
        active={number === activeTab}
      >
        {number}
      </Pagination.Item>
    );
  }

  const slicedLocalData = dataToDisplay.slice(
    (activeTab - 1) * entriesPerPage,
    activeTab * entriesPerPage
  );

  const formProps = {
    dateInput: dateInput,
    transNameInput: transNameInput,
    categoryInput: categoryInput,
    amountInput: amountInput,
    transModeInput: transModeInput,
    transactionForm: transactionForm,
    handleClose: handleClose,
    handleAddTransaction: handleAddTransaction,
  };

  const handleTransactionLogs = () => {
    filterCtx.setLogState(0);
    let newData = filterCtx.filterAll(0);
    // newData = sortStream(newData, sortCategory, sortDirection);
    setLocalData(newData);
    // sortCategoryHandler(sortCategory, sortDirection);
  };

  const handleAdjustmentLogs = () => {
    filterCtx.setLogState(1);
    let newData = filterCtx.filterAll(1);
    // newData = sortStream(newData, sortCategory, sortDirection);
    setLocalData(newData);
    // sortCategoryHandler(sortCategory, sortDirection);
  };

  const handleBothLogs = () => {
    filterCtx.setLogState(2);
    let newData = filterCtx.filterAll(2);
    // newData = sortStream(newData, sortCategory, sortDirection);
    setLocalData(newData);
    // sortCategoryHandler(sortCategory, sortDirection);
  };

  const [showValidationText, setShowValidationText] = useState(false);

  return (
    <div className={styles.right}>
      <Box>
        <Row className="align-items-center pb-3">
          <Col xs="auto">
            {" "}
            <h2 className={styles.header}>Transaction Log</h2>{" "}
          </Col>
          <Col xs="auto">
            {" "}
            <Button className={styles.btn} onClick={handleTransactionForm}>
              {" "}
              Add Transaction
            </Button>
          </Col>
          <Col xs="auto">
            <Form.Text>Sort By</Form.Text>
          </Col>
          <Col xs="auto">
            <Form.Select
              value={sortCategory}
              onChange={(e) => {
                setSortCategory(e.target.value);
                sortCategoryHandler(e.target.value, sortDirection);
              }}
              placeholder="Enter category"
            >
              <option value="Date"> Date </option>
              <option vale="Amount"> Amount </option>
              <option value="Transaction Name"> Transaction Name </option>
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button className={styles.btn} onClick={handleSortDirection}>
              {sortDirection && <ArrowUpwardIcon />}
              {!sortDirection && <ArrowDownwardIcon />}
            </Button>
          </Col>

          <Col xs="auto">
            <OverlayTrigger
              trigger="click"
              placement="auto"
              rootClose
              overlay={popover()}
            >
              <Button
                variant="light"
                aria-label="filter"
                className={styles.btn}
              >
                <FilterAltIcon />
              </Button>
            </OverlayTrigger>
          </Col>
          <Col xs="auto">
            <strong>
              {" "}
              <label> Total Amount: ${totalAmount} </label>
            </strong>
          </Col>
          <Col xs="auto">
            <Form.Check
              inline
              defaultChecked={filterCtx.logState === 0}
              label="Transaction Logs"
              name="group1"
              type="radio"
              id="inline-radio-1"
              onClick={handleTransactionLogs}
            />
            <Form.Check
              inline
              defaultChecked={filterCtx.logState === 1}
              label="Adjustment Logs"
              name="group1"
              type="radio"
              id="inline-radio-2"
              onClick={handleAdjustmentLogs}
            />
            <Form.Check
              inline
              defaultChecked={filterCtx.logState === 2}
              label="Both"
              name="group1"
              type="radio"
              id="inline-radio-3"
              onClick={handleBothLogs}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction Name</th>
                  <th>Category</th>
                  <th>Amount($)</th>
                  <th>Transaction Mode</th>
                </tr>
              </thead>
              <tbody>
                {slicedLocalData.map((entry) => {
                  return (
                    <tr>
                      <td>{new Date(entry.date).toDateString()}</td>
                      <td>{entry.information}</td>
                      <td>{entry.category}</td>
                      <td>{Number(entry.amount).toFixed(2)}</td>
                      <td>{entry.mode}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {slicedLocalData.length == 0 && (
              <p className={"p-5 " + styles.noGroupMessage}>
                You have no transaction information logged
              </p>
            )}
          </Col>
        </Row>

        <Row>
          <Col className="align-content-center">
            <Pagination className={styles.paginationBar}>{items}</Pagination>
          </Col>
        </Row>
      </Box>
      <SubmitTransactionModal
        showValidationText={showValidationText}
        formProps={formProps}
      />
    </div>
  );
}

export default Personal;
