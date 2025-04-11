"use client";

import { useEffect, useCallback, useState } from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getDashboardData } from "@/services/Dashboard";
import { useNavigate } from "react-router";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";

export type DashboardData = {
  title: string;
  value1: string;
  value2: string;
  charttype: string;
  chartsize: string;
  label1: string;
  lable2: string;
  color: string;
  detail: string;
};

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<
    Array<DashboardData[]> | []
  >([
    [
      {
        title: "TAPER ROLLER BEARING 32211",
        value1: "15",
        value2: "12701.175",
        charttype: "pie",
        chartsize: "w-4",
        label1: "Total Qty Sold",
        lable2: "Total Sell",
        color: "hsl(var(--chart-5))",
        detail: "",
      },
    ],
  ]);

  const navigate = useNavigate();

  const fetchDashBoardData = useCallback(async () => {
    try {
      const res = await getDashboardData();
      console.log(res.data);
      if (res.status == "success") {
        setDashboardData(res.data);
      } else if (res.status == "401") {
        navigate("/login");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  return (
    <section className="flex w-full h-full flex-wrap space-x-1 space-y-2  justify-evenly  overflow-y-scroll">
      {dashboardData.map((data, idx) => {
        if (data[0].charttype === "pie") {
          const pieData = data.map((itm) => ({
            name: itm.title,
            value: Number(itm.value1),
            value2: Number(itm.value2),
            label1: itm.label1,
            label2: itm.lable2,
            color: itm.color,
          }));

          const total = pieData.reduce((acc, item) => acc + item.value2, 0);

          return (
            <Card className="flex flex-col  md:w-8/12 lg:w-1/4 ">
              <CardHeader className="items-center pb-0">
                <CardTitle>{data[0].lable2}</CardTitle>
                <CardDescription>{data[0].detail}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  key={idx}
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieData}
                      dataKey="value2"
                      nameKey="name"
                      innerRadius={40}
                      strokeWidth={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {total.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  {data[0].lable2}
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        } else if (data[0].charttype === "bar") {
          const chartData = data.map((itm) => ({
            name: itm.title,
            value: Number(itm.value1),
            value2: Number(itm.value2),
            label1: itm.label1,
            label2: itm.lable2,
            color: itm.color,
          }));

          return (
            <Card
              key={`bar-${data[0].title}`}
              className="flex flex-col  md:w-8/12 lg:w-1/4"
            >
              <CardHeader>
                <CardTitle>{data[0].lable2}</CardTitle>
                <CardDescription>
                  {data[0].detail || "Bar chart data"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig}>
                  <BarChart data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="name"
                      tickLine={true}
                      tickMargin={10}
                      axisLine={true}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent indicator="line" />}
                    />
                    <Bar dataKey="value" radius={4}>
                      {chartData.map((index) => (
                        <Cell key={`bar-cell-${index}`} fill={"red"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        }
      })}
    </section>
  );
};

export default Dashboard;
