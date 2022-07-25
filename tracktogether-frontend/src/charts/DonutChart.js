import Victory from "./victory";

export default function DonutChart(props) {
  const VictoryPie = Victory.VictoryPie;
  const VictoryTooltip = Victory.VictoryTooltip;
  // const VictoryLegend = Victory.VictoryLegend;
  // const VictoryContainer = Victory.VictoryContainer;
  const VictoryLabel = Victory.VictoryLabel;
  const VictoryAxis = Victory.VictoryAxis;
  const VictoryChart = Victory.VictoryChart;
  const graphicColor = ["#1e47f0", "#0096ff", "#00cfff", "#00ffff"];

  function transformData(arr) {
    let temp = arr.reduce((json, current) => {
      if (json[current.category]) {
        json[current.category].amount += current.amount;
      } else {
        json[current.category] = {
          category: current.category,
          amount: current.amount,
        };
      }
      return json;
    }, {});
    return Object.values(temp);
  }

  function concatenateLabels(arr) {
    return arr.map((item) => {
      if (item.category != "Loading...") {
        const container = {};
        container["category"] = `${item.category}:\n$${item.amount}`;
        container["amount"] = item.amount;
        return container;
      } else {
        return item;
      }
    });
  }

  return (
    <VictoryChart width={150} height={150}>
      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: "transparent" },
        }}
      />
      <VictoryLabel
        standalone={false}
        text="Breakdown by Category"
        x={75}
        dy={27}
        textAnchor="middle"
        style={{ fontSize: 11, fill: "grey" }}
      />
      {props.data.length == 0 ? (
        <VictoryPie
          labelComponent={
            <VictoryTooltip
              flyoutStyle={{
                fill: "white",
              }}
            />
          }
          animate={{ easing: "exp" }}
          data={[{ x: "No data", y: 100 }]}
          colorScale={["grey"]}
          innerRadius={40}
        />
      ) : (
        <VictoryPie
          labelComponent={
            <VictoryTooltip
              pointerLength={0}
              style={{ fontSize: "8px" }}
              flyoutStyle={{
                fill: "white",
              }}
            />
          }
          standalone={false}
          animate={{ easing: "exp" }}
          data={concatenateLabels(transformData(props.data))}
          x="category"
          y="amount"
          colorScale={graphicColor}
          innerRadius={40}
        />
      )}
    </VictoryChart>
  );
}
