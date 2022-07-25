import { useEffect, useRef } from "react";
import * as d3 from "d3";

const MultilineChart = ({ inputData, dimensions }) => {
  function groupByDates(arr) {
    let temp = arr.reduce((json, current) => {
      const date = new Date(current.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const dateStr = `${month}/${year}`;
      if (json[dateStr]) {
        if (json[dateStr][current.category]) {
          json[dateStr][current.category] += current.amount;
        } else {
          json[dateStr][current.category] = current.amount;
        }
      } else {
        json[dateStr] = {
          _id: { year: year, month: month },
        };
        json[dateStr][current.category] = current.amount;
      }
      return json;
    }, {});
    return Object.values(temp);
  }

  function subtractMonths(numOfMonths, date = new Date()) {
    var d = date.getDate();
    date.setMonth(date.getMonth() - numOfMonths);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
  }
  function filterAndSortDates(arr) {
    const filteredArr = arr.filter(
      (item) =>
        new Date(`${item._id.year}-${item._id.month}`) >= subtractMonths(6)
    );

    const sortedArr = filteredArr.sort(
      (a, b) =>
        new Date(`${a._id.year}-${a._id.month}`) -
        new Date(`${b._id.year}-${b._id.month}`)
    );
    return sortedArr;
  }

  function getPastMonths(n) {
    let result = [];
    for (let i = n; i >= 0; i--) {
      let date = subtractMonths(i);
      result.push(new Date(date.getFullYear(), date.getMonth()));
    }
    return result;
  }

  function generateDataForCategory(arr, category) {
    // const months = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December",
    // ];

    const requiredDate = getPastMonths(5);

    const filteredArr =
      category === "All"
        ? arr.map((item) => {
            const obj = {};
            obj["_id"] = item._id;
            obj["amount"] = Object.values(item)
              .slice(1)
              .reduce((a, b) => a + b, 0);
            return obj;
          })
        : arr.map((item) => {
            const obj = {};
            obj["_id"] = item._id;
            obj["amount"] = item[category];
            return obj;
          });
    let result = [];
    requiredDate.forEach((date) => {
      const item = filteredArr.find(
        (item) =>
          date.getFullYear() === item._id.year &&
          date.getMonth() === item._id.month
      );
      if (item) {
        const container = {};
        container["date"] = new Date(item._id.year, item._id.month);
        container["amount"] = item.amount;
        result.push(container);
      } else {
        result.push({ date: date, amount: 0 });
      }
    });
    return result;
  }

  const transformedData = filterAndSortDates(groupByDates(inputData));
  const foodData = generateDataForCategory(transformedData, "Food");
  const transportData = generateDataForCategory(transformedData, "Transport");
  const billsData = generateDataForCategory(transformedData, "Bills");
  const othersData = generateDataForCategory(transformedData, "Others");
  const allData = generateDataForCategory(transformedData, "All");
  const data = [
    { name: "All", color: "#ffffff", data: allData },
    { name: "Food", color: "#ffffff", data: foodData },
    { name: "Transport", color: "#ffffff", data: transportData },
    { name: "Bills", color: "#ffffff", data: billsData },
    { name: "Others", color: "#ffffff", data: othersData },
  ];

  //starting to plot chart
  const svgRef = useRef(null);
  const { width, height, margin } = dimensions;
  const svgWidth = width + margin.left + margin.right;
  const svgHeight = height + margin.top + margin.bottom;

  useEffect(() => {
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data[0].data, (d) => d.date));
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data[0].data, (d) => d.amount) - 50,
        d3.max(data[0].data, (d) => d.amount) + 50,
      ])
      .range([height, 0]);

    //Create root container where we will append all other chart elements
    const svgEl = d3.select(svgRef.current);
    svgEl.selectAll("*").remove(); //Clear svg content before adding new elements
    const svg = svgEl
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // const xAxis = d3
    //   .axisBottom(xScale)
    //   .ticks(5)
    //   .tickSize(-height + margin.bottom)
    //   .tickFormat(d3.timeFormat("%b"));
    // const xAxisGroup = svg
    //   .append("g")
    //   .attr("transform", `translate(0,${height - margin.bottom})`)
    //   .call(xAxis);
    // xAxisGroup.select(".domain").remove();
    // xAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    // xAxisGroup
    //   .selectAll("text")
    //   .attr("opacity", 0.5)
    //   .attr("color", "white")
    //   .attr("font-size", "0.75rem");

    // const yAxis = d3.axisLeft(yScale).ticks(5).tickSize(-width);
    // const yAxisGroup = svg.append("g").call(yAxis);
    // yAxisGroup.select(".domain").remove();
    // yAxisGroup.selectAll("line").attr("stroke", "rgba(255, 255, 255, 0.2)");
    // yAxisGroup
    //   .selectAll("text")
    //   .attr("opacity", 0.5)
    //   .attr("color", "white")
    //   .attr("font-size", "0.75rem");

    const line = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.amount));
    svg
      .selectAll(".line")
      .data(data)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", (d) => d.color)
      .attr("stroke-width", 3)
      .attr("d", (d) => line(d.data));
  }, [data]);

  return <svg ref={svgRef} width={svgWidth} height={svgHeight} />;
};

export default MultilineChart;
