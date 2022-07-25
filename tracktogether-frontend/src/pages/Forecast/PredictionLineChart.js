import Victory from "../../charts/victory";

export default function LineChart(props) {
  const VictoryLine = Victory.VictoryLine;
  const VictoryChart = Victory.VictoryChart;
  const VictoryVoronoiContainer = Victory.VictoryVoronoiContainer;
  const VictoryAxis = Victory.VictoryAxis;
  const VictoryTooltip = Victory.VictoryTooltip;
  const VictoryLabel = Victory.VictoryLabel;

  return (
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
        data={props.data}
        style={{
          data: {
            stroke: "blue",
            strokeWidth: ({ active }) => (active ? 5 : 2),
          },
        }}
        x="month"
        y="amount"
      />
      <VictoryLabel
        standalone={false}
        text={props.type === "rnn" ? "RNN Model" : "SARIMA Model"}
        x={150}
        y={20}
        style={{ fontSize: 20, fill: "grey" }}
      />
    </VictoryChart>
  );
}
