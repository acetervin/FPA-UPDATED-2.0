import React from 'react';
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  Line,
  Bar,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ChartContainer } from './chart';

interface BaseChartProps {
  data: any[];
  title: string;
}

interface XYChartProps extends BaseChartProps {
  xField: string;
  yField: string;
}

interface PieChartProps extends BaseChartProps {
  nameField: string;
  valueField: string;
}

export function LineChart({ data, xField, yField, title }: XYChartProps) {
  return (
    <ChartContainer config={{ [title]: { label: title } }}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={yField} stroke="#8884d8" />
      </RechartsLineChart>
    </ChartContainer>
  );
}

export function BarChart({ data, xField, yField, title }: XYChartProps) {
  return (
    <ChartContainer config={{ [title]: { label: title } }}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xField} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={yField} fill="#8884d8" />
      </RechartsBarChart>
    </ChartContainer>
  );
}

export function PieChart({ data, nameField, valueField, title }: PieChartProps) {
  return (
    <ChartContainer config={{ [title]: { label: title } }}>
      <RechartsPieChart>
        <Pie
          data={data}
          dataKey={valueField}
          nameKey={nameField}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </RechartsPieChart>
    </ChartContainer>
  );
}
