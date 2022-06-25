import React, { useContext, useEffect } from "react";
import FilterContext from "../../../store/FilterContext";

import { Form } from "react-bootstrap";

function TransactionModeFilter(props) {
  useEffect(() => {
    filterCtx.changeFilterIndividual(index, applyFilter);
  }, []);

  const index = props.index;
  const filterCtx = useContext(FilterContext);
  const optionState = filterCtx.optionState[index];
  const currData = filterCtx.currData;
  // const localData = props.localData;
  const setLocalData = props.setLocalData;

  const uniqueModes = Array.from(new Set(currData.map((entry) => entry.mode)));
  uniqueModes.unshift("All");

  const handleTransactionMode = (e) => {
    filterCtx.changeTransactionMode(index, e.target.value);
    const newData = filterCtx.filterAll(filterCtx.logState);
    setLocalData(newData);
  };

  const applyFilter = (dataStream) => {
    let newData = [...dataStream];
    newData = newData.filter((entry) => {
      return optionState.transactionMode === "All"
        ? true
        : entry.mode === optionState.transactionMode;
    });
    return newData;
  };

  return (
    <Form.Group className="my-3">
      <Form.Label> Select Mode </Form.Label>
      <Form.Select
        value={optionState.transactionMode}
        onChange={handleTransactionMode}
      >
        {uniqueModes.map((entry) => {
          return <option> {entry} </option>;
        })}
      </Form.Select>
    </Form.Group>
  );
}

export default TransactionModeFilter;
