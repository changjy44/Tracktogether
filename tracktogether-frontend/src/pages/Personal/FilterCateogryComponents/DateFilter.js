import React, { useContext, useEffect } from "react";
import FilterContext from "../../../store/FilterContext";

import { Form, Stack } from "react-bootstrap";

function DateFilter(props) {
  useEffect(() => {
    filterCtx.changeFilterIndividual(index, applyFilter);
  }, []);

  const index = props.index;
  const filterCtx = useContext(FilterContext);
  const optionState = filterCtx.optionState[index];
  const currData = filterCtx.currData;
  // const localData = props.localData;
  const setLocalData = props.setLocalData;

  const uniqueYears = Array.from(
    new Set(currData.map((entry) => new Date(entry.date).getFullYear()))
  );

  uniqueYears.unshift("All");
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const uniqueMonths = Array.from(
    new Set(currData.map((entry) => months[new Date(entry.date).getMonth()]))
  );
  uniqueMonths.unshift("All");

  // const [currYear, setCurrYear] = useState("All");

  const handleYear = (e) => {
    filterCtx.changeYear(index, e.target.value);
    const newData = filterCtx.filterAll(filterCtx.logState);
    setLocalData(newData);
  };

  const handleMonth = (e) => {
    // console.log(currMonth);
    filterCtx.changeMonth(index, e.target.value);
    const newData = filterCtx.filterAll(filterCtx.logState);
    setLocalData(newData);
  };

  const applyFilter = (dataStream) => {
    let newData = [...dataStream];
    newData = newData.filter((entry) => {
      return optionState.dateYear === "All"
        ? true
        : new Date(entry.date).getFullYear() === Number(optionState.dateYear);
    });
    newData = newData.filter((entry) => {
      return optionState.dateMonth === "All"
        ? true
        : months[new Date(entry.date).getMonth()] == optionState.dateMonth;
    });
    return newData;
  };

  return (
    <Stack direction="horizontal" gap={3}>
      <Form.Group className="my-3">
        <Form.Label> Year </Form.Label>
        <Form.Select value={optionState.dateYear} onChange={handleYear}>
          {uniqueYears.map((entry) => {
            return <option> {entry} </option>;
          })}
        </Form.Select>
      </Form.Group>
      <Form.Group className="my-3">
        <Form.Label> Month </Form.Label>
        <Form.Select value={optionState.dateMonth} onChange={handleMonth}>
          {uniqueMonths.map((entry) => {
            return <option> {entry} </option>;
          })}
        </Form.Select>
      </Form.Group>
    </Stack>
  );
}

export default DateFilter;
