import Victory from "./victory";

export default function LineChart(props) {
  const VictoryLine = Victory.VictoryLine;
  const VictoryChart = Victory.VictoryChart;
  const VictoryVoronoiContainer = Victory.VictoryVoronoiContainer;
  const VictoryAxis = Victory.VictoryAxis;
  const VictoryTooltip = Victory.VictoryTooltip;
  const VictoryLabel = Victory.VictoryLabel;
  //   const VictoryContainer = Victory.VictoryContainer;
  function groupByDates(arr) {
    let temp = arr.reduce((json, current) => {
      const date = new Date(current.date);
      const month = date.getMonth();
      const year = date.getFullYear();
      const dateStr = `${month}/${year}`;
      if (json[dateStr]) {
        json[dateStr].amount += current.amount;
      } else {
        json[dateStr] = {
          _id: { year: year, month: month },
          amount: current.amount,
        };
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
  // console.log(props);
  function filterAndSortDates(arr) {
    const filteredArr = arr.filter(
      (item) =>
        new Date(`${item._id.year}-${item._id.month}`) >= subtractMonths(6)
    );
    // console.log(filtered_arr);

    const sortedArr = filteredArr.sort(
      (a, b) =>
        new Date(`${a._id.year}-${a._id.month}`) -
        new Date(`${b._id.year}-${b._id.month}`)
    );
    return sortedArr;
  }

  function getPastMonths(n) {
    let result = [];
    // const currMonth = new Date().getMonth();
    for (let i = n; i >= 0; i--) {
      // let rel_month = currMonth - i;
      // let abs_month = rel_month >= 0 ? rel_month : rel_month + 12;
      // result.push(abs_month);
      result.push(subtractMonths(i).getMonth());
    }
    return result;
  }

  function mapMonthToValue(arr) {
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

    const requiredMonths = getPastMonths(5).map((item) => months[item]);

    let result = [];
    requiredMonths.forEach((month) => {
      const item = arr.find((item) => month == months[item._id.month]);
      if (item) {
        const container = {};
        container["month"] = months[item._id.month];
        container["amount"] = item.amount;
        result.push(container);
      } else {
        result.push({ month: month, amount: 0 });
      }
    });
    // console.log(result);
    return result;
  }

  function transform_data(arr) {
    return mapMonthToValue(filterAndSortDates(groupByDates(arr)));
  }

  console.log("entered linechart component");

  return props.data.length == 0 ? (
    <VictoryChart>
      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: "transparent" },
        }}
      />
      <VictoryLabel
        text="Breakdown over last 6 months"
        x={50}
        dy={10}
        style={{ fontSize: 28, fill: "grey" }}
      />
      <VictoryLabel
        text="You have no transaction history"
        x={210}
        y={140}
        textAnchor="middle"
        style={{ fontSize: 25, fill: "black" }}
      />
    </VictoryChart>
  ) : (
    <VictoryChart
      containerComponent={
        <VictoryVoronoiContainer
          voronoiDimension="x"
          labels={({ datum }) => `amount: $${datum.amount}`}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: "15px" }}
              flyoutStyle={{ fill: "white" }}
            />
          }
        />
      }
    >
      <VictoryAxis />

      <VictoryLine
        animate
        data={transform_data(props.data)}
        style={{
          data: {
            stroke: "tomato",
            strokeWidth: ({ active }) => (active ? 5 : 2),
          },
          labels: { fill: "tomato" },
        }}
        x="month"
        y="amount"
      />
      <VictoryLabel
        text="Breakdown over last 6 months"
        x={50}
        dy={10}
        style={{ fontSize: 28, fill: "grey" }}
      />
    </VictoryChart>
  );
}
