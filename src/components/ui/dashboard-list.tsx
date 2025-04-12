"use client";
import { AnimatedCounter } from "./counter";

type ListItem = {
  title: string;
  value1: number;
  label1: string;
  color: string;
};

export const DashList = ({ data }: { data: ListItem[] | any[] }) => {
  return (
    <div className="mt-2 space-y-1">
      {data.map((item, index) => (
        <div
          key={index}
          className="rounded-md border border-l-4 border-l-red-500  shadow-sm bg-card 
           flex justify-between items-center px-1 h-10"
        >
          <p className="font-bold text-muted-foreground text-sm">
            {item.title}
          </p>
          <p className="text-lg font-bold text-primary">
            <AnimatedCounter title="" value={item.value1} />{" "}
          </p>
        </div>
      ))}
    </div>
  );
};
