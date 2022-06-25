import Victory from "./victory";

export default function DonutChart(props) {
  const VictoryPie = Victory.VictoryPie;
  const VictoryTooltip = Victory.VictoryTooltip;
  // const VictoryLegend = Victory.VictoryLegend;
  const VictoryContainer = Victory.VictoryContainer;
  const VictoryLabel = Victory.VictoryLabel;
  // const VictoryAxis = Victory.VictoryAxis;
  // const VictoryChart = Victory.VictoryChart;
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
    <VictoryContainer width={250} height={250} style={{ paddingTop: 40 }}>
      <VictoryLabel
        standalone={false}
        text="Breakdown by Category"
        x={120}
        y={25}
        textAnchor="middle"
        style={{ fontSize: 20, fill: "grey" }}
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
          standalone={false}
          animate={{ easing: "exp" }}
          width={240}
          height={240}
          data={[{ x: "No data", y: 100 }]}
          colorScale={["grey"]}
          innerRadius={40}
        />
      ) : (
        <VictoryPie
          labelComponent={
            <VictoryTooltip
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
          width={240}
          height={240}
          colorScale={graphicColor}
          innerRadius={40}
        />
      )}
    </VictoryContainer>
  );
}
