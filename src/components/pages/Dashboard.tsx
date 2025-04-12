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
  Line,
  LineChart,
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
import { AnimatedCounter } from "../ui/counter";
import { DashList } from "../ui/dashboard-list";

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

type DashSection = {
  orderid: number;
  title: string;
  chartsize: string;
  card: string;
};

type DashSubSection = {
  orderid: number;
  info: string;
  position: string;
  size: string;
};

type DashboardStruncture = {
  section: DashSection[];
  subsection: DashSubSection[];
  dashboardData: Array<DashboardData[]>;
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
    DashboardStruncture | undefined
  >({
    section: [{ orderid: 1, title: "", chartsize: "", card: "1" }],
    subsection: [{ orderid: 1, info: "", position: "", size: "" }],
    dashboardData: [
      [
        {
          title: "",
          value1: "",
          value2: "",
          charttype: "",
          chartsize: "",
          label1: "",
          lable2: "",
          color: "",
          detail: "",
        },
      ],
    ],
  });

  const navigate = useNavigate();

  const fetchDashBoardData = useCallback(async () => {
    try {
      const res = await getDashboardData();

      if (res.status == "success") {
        setDashboardData({
          section: res.data[0],
          subsection: res.data[1],
          dashboardData: res.data.slice(2),
        });
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
    <div className=" flex flex-wrap justify-start sm:justify-between align-middle w-full  h-full space-x-1 space-y-2 overflow-y-scroll overflow-x-hidden">
      {dashboardData?.section.map((data, idx) => {
        return (
          <Card
            key={idx}
            className={`flex  flex-col h-fit  w-[${data.chartsize}%] `}
          >
            <CardHeader className="items-start pb-0">
              <CardTitle>{data.title}</CardTitle>
            </CardHeader>
            <CardContent className=" pb-0">
              <section className=" w-full flex flex-wrap justify-around  mt-2 py-2">
                {dashboardData.subsection.map((itm, index) => {
                  if (itm.position == data.card)
                    return (
                      <Card
                        key={index}
                        className={` w-[${itm.size}%] flex h-fit max-h-96 space-x-1  flex-col align-middle  py-1 m-1 `}
                      >
                        <CardHeader className="items-start pb-0">
                          <CardTitle>{itm.info}</CardTitle>
                        </CardHeader>
                        <CardContent className={`  align-middle pb-1 w-full `}>
                          {dashboardData.dashboardData.map(
                            (graphicData, key) => {
                              if (index == key) {
                                if (graphicData[0].charttype == "meter") {
                                  return (
                                    <div className=" text-3xl self-center">
                                      <AnimatedCounter
                                        title={graphicData[0].title}
                                        value={parseInt(graphicData[0].value1)}
                                      />
                                    </div>
                                  );
                                }
                                if (graphicData[0].charttype == "list") {
                                  return (
                                    <div className=" h-44 my-1  overflow-y-scroll .hideScroll">
                                      <DashList data={graphicData} />
                                    </div>
                                  );
                                } else if (graphicData[0].charttype == "bar") {
                                  const chartData = graphicData.map((itm) => ({
                                    name: itm.title,
                                    value: Number(itm.value1),
                                    value2: Number(itm.value2),
                                    label1: itm.label1,
                                    label2: itm.lable2,
                                    color: itm.color,
                                  }));

                                  return (
                                    <div className=" mt-3">
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
                                            content={
                                              <ChartTooltipContent indicator="line" />
                                            }
                                          />
                                          <Bar dataKey="value" radius={4}>
                                            {chartData.map((index) => (
                                              <Cell
                                                key={`bar-cell-${index}`}
                                                fill={"red"}
                                              />
                                            ))}
                                          </Bar>
                                        </BarChart>
                                      </ChartContainer>
                                    </div>
                                  );
                                } else if (graphicData[0].charttype == "line") {
                                  const chartData = graphicData.map((itm) => ({
                                    name: itm.title,
                                    value: Number(itm.value1),
                                    value2: Number(itm.value2),
                                    label1: itm.label1,
                                    label2: itm.lable2,
                                    color: itm.color,
                                  }));

                                  return (
                                    <div className="max-w-md h-auto mt-3">
                                      <ChartContainer config={chartConfig}>
                                        <LineChart
                                          accessibilityLayer
                                          data={chartData}
                                          margin={{
                                            left: 12,
                                            right: 12,
                                          }}
                                        >
                                          <CartesianGrid vertical={false} />
                                          <XAxis
                                            dataKey="name"
                                            tickLine={true}
                                            axisLine={true}
                                            tickMargin={10}
                                          />
                                          <ChartTooltip
                                            cursor={true}
                                            content={
                                              <ChartTooltipContent hideLabel />
                                            }
                                          />
                                          <Line
                                            dataKey="value"
                                            type="natural"
                                            stroke="red"
                                            strokeWidth={3}
                                            dot={true}
                                          />
                                        </LineChart>
                                      </ChartContainer>
                                    </div>
                                  );
                                }
                              }
                            }
                          )}
                        </CardContent>
                      </Card>
                    );
                })}
              </section>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
  //(
  //   <section className="flex w-full h-full flex-wrap space-x-1 space-y-2  justify-evenly  overflow-y-scroll">
  //     {dashboardData.map((data, idx) => {
  //       if (data[0].charttype === "pie") {
  //         const pieData = data.map((itm) => ({
  //           name: itm.title,
  //           value: Number(itm.value1),
  //           value2: Number(itm.value2),
  //           label1: itm.label1,
  //           label2: itm.lable2,
  //           color: itm.color,
  //         }));

  //         const total = pieData.reduce((acc, item) => acc + item.value2, 0);

  //         return (
  //           <Card className="flex flex-col  md:w-8/12 lg:w-1/4 ">
  //             <CardHeader className="items-center pb-0">
  //               <CardTitle>{data[0].lable2}</CardTitle>
  //               <CardDescription>{data[0].detail}</CardDescription>
  //             </CardHeader>
  //             <CardContent className="flex-1 pb-0">
  //               <ChartContainer
  //                 key={idx}
  //                 config={chartConfig}
  //                 className="mx-auto aspect-square max-h-[250px]"
  //               >
  //                 <PieChart>
  //                   <ChartTooltip
  //                     cursor={false}
  //                     content={<ChartTooltipContent hideLabel />}
  //                   />
  //                   <Pie
  //                     data={pieData}
  //                     dataKey="value2"
  //                     nameKey="name"
  //                     innerRadius={40}
  //                     strokeWidth={5}
  //                   >
  //                     {pieData.map((entry, index) => (
  //                       <Cell key={`cell-${index}`} fill={entry.color} />
  //                     ))}
  //                     <Label
  //                       content={({ viewBox }) => {
  //                         if (viewBox && "cx" in viewBox && "cy" in viewBox) {
  //                           return (
  //                             <text
  //                               x={viewBox.cx}
  //                               y={viewBox.cy}
  //                               textAnchor="middle"
  //                               dominantBaseline="middle"
  //                             >
  //                               <tspan
  //                                 x={viewBox.cx}
  //                                 y={viewBox.cy}
  //                                 className="fill-foreground text-3xl font-bold"
  //                               >
  //                                 {total.toLocaleString()}
  //                               </tspan>
  //                               <tspan
  //                                 x={viewBox.cx}
  //                                 y={(viewBox.cy || 0) + 24}
  //                                 className="fill-muted-foreground"
  //                               >
  //                                 {data[0].lable2}
  //                               </tspan>
  //                             </text>
  //                           );
  //                         }
  //                       }}
  //                     />
  //                   </Pie>
  //                 </PieChart>
  //               </ChartContainer>
  //             </CardContent>
  //           </Card>
  //         );
  //       } else if (data[0].charttype === "bar") {
  //         const chartData = data.map((itm) => ({
  //           name: itm.title,
  //           value: Number(itm.value1),
  //           value2: Number(itm.value2),
  //           label1: itm.label1,
  //           label2: itm.lable2,
  //           color: itm.color,
  //         }));

  //         return (
  //           <Card
  //             key={`bar-${data[0].title}`}
  //             className="flex flex-col  md:w-8/12 lg:w-1/4"
  //           >
  //             <CardHeader>
  //               <CardTitle>{data[0].lable2}</CardTitle>
  //               <CardDescription>
  //                 {data[0].detail || "Bar chart data"}
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <ChartContainer config={chartConfig}>
  //                 <BarChart data={chartData}>
  //                   <CartesianGrid vertical={false} />
  //                   <XAxis
  //                     dataKey="name"
  //                     tickLine={true}
  //                     tickMargin={10}
  //                     axisLine={true}
  //                   />
  //                   <YAxis />
  //                   <ChartTooltip
  //                     cursor={false}
  //                     content={<ChartTooltipContent indicator="line" />}
  //                   />
  //                   <Bar dataKey="value" radius={4}>
  //                     {chartData.map((index) => (
  //                       <Cell key={`bar-cell-${index}`} fill={"red"} />
  //                     ))}
  //                   </Bar>
  //                 </BarChart>
  //               </ChartContainer>
  //             </CardContent>
  //           </Card>
  //         );
  //       }
  //     })}
  //   </section>
  // );
};

export default Dashboard;
