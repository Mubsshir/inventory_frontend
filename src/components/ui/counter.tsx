"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  title: string;
  value: number;
  duration?: number;
};

export const AnimatedCounter = ({
  title,
  value,
  duration = 3000,
}: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = Math.ceil(value / (duration / 16));

    const timer = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div className="rounded-md  p-4 shadow-sm bg-card">
      <p className=" text-muted-foreground">{title}</p>
      <p className=" font-bold text-primary mt-1">{count.toLocaleString()}</p>
    </div>
  );
};
