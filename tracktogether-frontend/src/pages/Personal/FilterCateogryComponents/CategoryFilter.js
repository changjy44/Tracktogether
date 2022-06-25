import React, { useContext, useEffect } from "react";
import FilterContext from "../../../store/FilterContext";

import { Form } from "react-bootstrap";

function CategoryFilter(props) {
  useEffect(() => {
    filterCtx.changeFilterIndividual(index, applyFilter);
  }, []);

  const index = props.index;
  const filterCtx = useContext(FilterContext);
  const optionState = filterCtx.optionState[index];
  const currData = filterCtx.currData;
  // const localData = props.localData;
  const setLocalData = props.setLocalData;

  const uniqueCategories = Array.from(
    new Set(currData.map((entry) => entry.category))
  );
  uniqueCategories.unshift("All");

  const handleCategory = (e) => {
    filterCtx.changeCategory(index, e.target.value);
    const newData = filterCtx.filterAll(filterCtx.logState);
    setLocalData(newData);
  };

  const applyFilter = (dataStream) => {
    let newData = [...dataStream];
    newData = newData.filter((entry) => {
      return optionState.category === "All"
        ? true
        : entry.category === optionState.category;
    });
    return newData;
  };

  return (
    <Form.Group className="my-3">
      <Form.Label> Select Category </Form.Label>
      <Form.Select value={optionState.category} onChange={handleCategory}>
        {uniqueCategories.map((entry) => {
          return <option> {entry} </option>;
        })}
      </Form.Select>
    </Form.Group>
  );
}

export default CategoryFilter;
