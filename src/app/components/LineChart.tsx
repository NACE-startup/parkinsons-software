import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "motion/react";

interface LineChartProps {
  data: any[];
  dataKey: string;
  xKey: string;
  color?: string;
  yAxisLabel?: string;
}

export default function AnimatedLineChart({
  data,
  dataKey,
  xKey,
  color = "var(--accent-1)",
  yAxisLabel,
}: LineChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border-1)" vertical={false} />
          <XAxis
            dataKey={xKey}
            stroke="var(--text-2)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--text-2)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: 12, fill: "var(--text-2)" },
                  }
                : undefined
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--surface-1)",
              border: "1px solid var(--border-1)",
              borderRadius: "12px",
              boxShadow: "var(--shadow-card)",
              padding: "8px 12px",
            }}
            labelStyle={{ color: "var(--text-2)", fontSize: 12 }}
            itemStyle={{ color: "var(--text-1)", fontSize: 14, fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 0, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--bg-0)" }}
            animationDuration={600}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
