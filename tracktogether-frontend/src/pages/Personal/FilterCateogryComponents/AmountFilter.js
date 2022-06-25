import React, { useContext, useEffect } from "react";
import FilterContext from "../../../store/FilterContext";

import { Form, Stack } from "react-bootstrap";

function AmountFilter(props) {
  useEffect(() => {
    filterCtx.changeFilterIndividual(index, applyFilter);
  }, []);

  const index = props.index;
  const filterCtx = useContext(FilterContext);
  const optionState = filterCtx.optionState[index];
  // const currData = filterCtx.currData;
  // const localData = props.localData;
  const setLocalData = props.setLocalData;

  const handleLowerAmount = (e) => {
    filterCtx.changeLowerAmount(index, e.target.value);
    const newData = filterCtx.filterAll(filterCtx.logState);
    setLocalData(newData);
  };

  const handleUpperAmount = (e) => {
    filterCtx.changeUpperAmount(index, e.target.value);
    const newData = filterCtx.filterAll(filterCtx.logState);
    setLocalData(newData);
  };

  const applyFilter = (dataStream) => {
    let newData = [...dataStream];
    newData = newData.filter((entry) => {
      return optionState.lowerAmount === ""
        ? true
        : entry.amount >= optionState.lowerAmount;
    });
    newData = newData.filter((entry) => {
      return optionState.upperAmount === ""
        ? true
        : entry.amount <= optionState.upperAmount;
    });
    return newData;
  };

  return (
    <>
      <Stack direction="horizontal" gap={3}>
        <Form.Group className="my-3">
          <Form.Label> Greater than </Form.Label>
          <Form.Control
            value={optionState.lowerAmount}
            onChange={handleLowerAmount}
            type="number"
            placeholder=" Amount"
          />
        </Form.Group>
        <Form.Group className="my-3">
          <Form.Label> Smaller than </Form.Label>
          <Form.Control
            value={optionState.upperAmount}
            onChange={handleUpperAmount}
            type="number"
            placeholder=" Amount"
          />
        </Form.Group>
      </Stack>
      <Form.Text> Leave empty for no bounds</Form.Text>
    </>
  );
}
export default AmountFilter;
