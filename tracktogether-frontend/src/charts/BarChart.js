import Victory from "./victory";
// import GroupContext from "../store/GroupContext";
import { useContext } from "react";
import AuthContext from "../store/AuthContext";

export default function BarChart(props) {
  const VictoryBar = Victory.VictoryBar;
  const VictoryTooltip = Victory.VictoryTooltip;
  const VictoryAxis = Victory.VictoryAxis;
  const VictoryChart = Victory.VictoryChart;
  const VictoryLabel = Victory.VictoryLabel;

  // const grpCtx = useContext(GroupContext);
  // console.log(grpCtx);

  const authCtx = useContext(AuthContext);

  console.log(props.data);
  function transformData(arr) {
    let temp = arr.map((group) => {
      const container = {};
      const user = group.users.filter((u) => u.username == authCtx.username);
      const userAmt = user[0].amount * -1;
      container["y"] = userAmt;
      container["label"] = `${group.name}:\n$${userAmt}`;
      container["fill"] = userAmt >= 0 ? "green" : "red";
      return container;
    });
    const netSum = temp.reduce((total, current) => {
      return total + current.y;
    }, 0);
    const netJson = {
      y: netSum,
      label: `Net:\n$${netSum}`,
      fill: netSum >= 0 ? "turquoise" : "pink",
    };
    temp.unshift(netJson);
    console.log(temp);
    return temp;
  }

  function isCleanRecord(arr) {
    return (
      transformData(arr).reduce((item, current) => {
        return item + current.y;
      }, 0) === 0
    );
  }

  return isCleanRecord(props.data) || props.data.length == 0 ? (
    <VictoryChart>
      <VictoryAxis
        style={{
          axis: { stroke: "transparent" },
          ticks: { stroke: "transparent" },
          tickLabels: { fill: "transparent" },
        }}
      />
      <VictoryLabel
        text="Debt Overview"
        x={225}
        textAnchor="middle"
        style={{ fontSize: 35, fill: "grey" }}
      />
      <VictoryLabel
        text="You have a clean record"
        x={230}
        y={140}
        textAnchor="middle"
        style={{ fontSize: 25, fill: "green" }}
      />
    </VictoryChart>
  ) : (
    <VictoryChart domainPadding={30}>
      <VictoryLabel
        text="Debt Overview"
        x={225}
        textAnchor="middle"
        style={{ fontSize: 35, fill: "grey" }}
      />
      <VictoryAxis tickFormat={() => ""} crossAxis="false" />
      <VictoryBar
        // standalone={false}
        horizontal
        labelComponent={
          <VictoryTooltip
            style={{ fontSize: "20px" }}
            pointerLength={20}
            cornerRadius={30}
            flyoutStyle={{
              fill: "white",
            }}
          />
        }
        animate
        data={transformData(props.data)}
        //   y="total"
        style={{
          data: { fill: ({ datum }) => datum.fill },
        }}
        events={[
          {
            target: "data",
            eventHandlers: {
              onMouseOver: () => {
                return [
                  {
                    target: "data",
                    mutation: (props) => ({
                      style: {
                        fill: props.style.fill,
                        width: 50,
                      },
                    }),
                  },
                  {
                    target: "labels",
                    mutation: () => ({ active: true }),
                  },
                ];
              },
              onMouseOut: () => {
                return [
                  {
                    target: "data",
                    mutation: () => {},
                  },
                  {
                    target: "labels",
                    mutation: () => ({ active: false }),
                  },
                ];
              },
            },
          },
        ]}
      />
    </VictoryChart>
  );
}
