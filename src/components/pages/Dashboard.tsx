"use client";

import { useEffect, useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const fetchDashBoardData = useCallback(async () => {
    setLoading(true);
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
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashBoardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full overflow-y-scroll space-y-4 p-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="w-full">
            <CardHeader className="px-4">
              <Skeleton className="h-6 w-1/3 bg-gray-300" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="space-y-2">
                    <Skeleton className="h-6 w-3/4 bg-gray-200" />
                    <Skeleton className="h-40 w-full rounded-md bg-gray-200" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-scroll space-y-2">
      {dashboardData?.section.map((data, idx) => {
        return (
          // this is main section
          <Card key={idx} className={`w-[${data.chartsize}%]`}>
            <CardHeader className="items-start px-2 m-0">
              <CardTitle className="text-red-500 font-extrabold text-lg">
                {data.title}
              </CardTitle>
            </CardHeader>
            <CardContent className={`w-full`}>
              <section className="flex w-full space-x-1 space-y-1 lg:flex-row md:flex-col flex-col ">
                {dashboardData.subsection.map((itm, index) => {
                  if (itm.position == data.card)
                    return (
                      // this is subsection
                      <div
                        key={index}
                        className={` ${itm.size} sm:w-full lg-flex-row space-y-1 sm:flex-col border  border-b-2 border-b-red-400 shadow-md p-4 rounded-lg `}
                      >
                        <h3 className="font-semibold text-lg ">{itm.info}</h3>
                        {dashboardData.dashboardData.map((graphicData, key) => {
                          if (index == key) {
                            if (graphicData[0].charttype == "meter") {
                              return (
                                <div className={`w-full  text-3xl `}>
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
                                <div className=" ">
                                  <ChartContainer
                                    className={`h-64  md:${itm.size} w-full`}
                                    config={chartConfig}
                                  >
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
                            } else if (graphicData[0].charttype == "pie") {
                              const chartData = graphicData.map((itm) => ({
                                name: itm.title,
                                value: Number(itm.value1),
                                value2: Number(itm.value2),
                                label1: itm.label1,
                                label2: itm.lable2,
                                color: itm.color,
                              }));

                              return (
                                <div className=" ">
                                  <ChartContainer
                                    key={idx}
                                    config={chartConfig}
                                    className="mx-auto aspect-square max-h-[250px]"
                                  >
                                    <PieChart>
                                      <ChartTooltip
                                        cursor={false}
                                        content={
                                          <ChartTooltipContent hideLabel />
                                        }
                                      />
                                      <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={40}
                                        strokeWidth={5}
                                      >
                                        {chartData.map((entry, index) => (
                                          <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                          />
                                        ))}
                                        <Label
                                          content={({ viewBox }) => {
                                            if (
                                              viewBox &&
                                              "cx" in viewBox &&
                                              "cy" in viewBox
                                            ) {
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
                                                    {chartData[0].value.toLocaleString()}
                                                  </tspan>
                                                  <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                  >
                                                    {graphicData[0].title}
                                                  </tspan>
                                                </text>
                                              );
                                            }
                                          }}
                                        />
                                      </Pie>
                                    </PieChart>
                                  </ChartContainer>
                                </div>
                              );
                            }
                          }
                        })}
                      </div>
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
