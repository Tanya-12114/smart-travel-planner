"use client"

import { PieChart, Pie, Tooltip } from "recharts"

export default function BudgetChart({ data }) {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        outerRadius={120}
      />
      <Tooltip />
    </PieChart>
  )
}