import type * as React from "react";
import { cn } from "../../../lib/utils";

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  icon,
  className,
  ...props
}: StatCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 bg-custom-blue3 text-white  shadow-md h-64",
        className
      )}
      {...props}
    >
      {icon && <div className="mb-4 text-white">{icon}</div>}
      <h3 className="text-xl font-medium text-center">{title}</h3>
      <p className="text-6xl font-bold mt-4">{value}</p>
    </div>
  );
}
