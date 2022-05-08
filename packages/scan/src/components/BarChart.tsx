import { useMemo } from "react";
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Text } from "@visx/text";

export type Data = {
  label: string;
  value: number;
};

export type BarChartProps = {
  width: number;
  height: number;
  events?: boolean;
  data: Data[];
  margin?: { top: number; right: number; bottom: number; left: number };
};

const defaultMargin = { top: 40, right: 30, bottom: 50, left: 40 };
const getLabel = (d: Data) => d.label;
const getValue = (d: Data) => d.value;

export default function BarChart({
  width,
  height,
  data,
  events = false,
  margin = defaultMargin,
}: BarChartProps) {
  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales, memoize for performance
  const xScale = useMemo(
    () =>
      scaleBand<string>({
        range: [0, xMax],
        round: true,
        domain: data.map(getLabel),
        padding: 0.4,
      }),
    [xMax]
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        round: true,
        domain: [0, Math.max(...data.map(getValue))],
      }),
    [yMax]
  );

  return (
    <svg width={width} height={height}>
      <Group top={60} left={40}>
        {data.map((d, index) => {
          const label = getLabel(d);
          const barWidth = xScale.bandwidth();
          const barHeight = yMax - (yScale(getValue(d)) ?? 0);
          const barX = xScale(label);
          const barY = yMax - barHeight;

          return (
            <Group key={label}>
              <Bar
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="rgba(23, 233, 217, .5)"
                onClick={() => {
                  if (events) alert(`click`);
                }}
              />
              <Text
                x={barX}
                dx={30}
                dy={10}
                y={yMax - barHeight}
                fill="black"
                fontSize={12}
                verticalAnchor="start"
                textAnchor="middle"
              >
                {`${Math.round(getValue(d))}%`}
              </Text>
            </Group>
          );
        })}
      </Group>
      <AxisLeft
        top={60}
        left={60}
        scale={yScale}
        label="Y axis"
        // tickFormat={formatDate}
        stroke="#000"
        tickStroke="#000"
        hideZero
      />
      <AxisBottom
        top={yMax + 60}
        left={40}
        scale={xScale}
        // tickFormat={formatDate}
        stroke="#000"
        tickStroke="#000"
        tickLabelProps={() => ({
          fill: "#000",
          fontSize: 11,
          textAnchor: "middle",
        })}
      />
    </svg>
  );
}
