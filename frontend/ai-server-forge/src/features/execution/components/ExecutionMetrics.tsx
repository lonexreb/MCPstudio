import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useExecutionHistory } from '@/features/execution/hooks/use-execution-history';

const COLORS = ['#2563eb', '#7c3aed', '#0d9488', '#f59e0b', '#ef4444', '#8b5cf6'];

interface ExecutionMetricsProps {
  serverId?: string;
}

const ExecutionMetrics = ({ serverId }: ExecutionMetricsProps) => {
  const records = useExecutionHistory(serverId, 100);

  if (!records || records.length === 0) {
    return (
      <div className="text-center border border-dashed rounded-md p-8">
        <p className="text-sm text-muted-foreground">
          Execute some tools to see metrics here
        </p>
      </div>
    );
  }

  // Timing data (last 20 executions, chronological)
  const timingData = [...records]
    .reverse()
    .slice(-20)
    .map((r, i) => ({
      index: i + 1,
      name: r.toolName,
      time: r.executionTime,
    }));

  // Success/error counts per tool
  const toolStats = records.reduce<Record<string, { name: string; success: number; error: number }>>((acc, r) => {
    if (!acc[r.toolName]) acc[r.toolName] = { name: r.toolName, success: 0, error: 0 };
    acc[r.toolName][r.status]++;
    return acc;
  }, {});
  const barData = Object.values(toolStats);

  // Tool distribution for pie chart
  const toolCounts = records.reduce<Record<string, number>>((acc, r) => {
    acc[r.toolName] = (acc[r.toolName] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(toolCounts).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Execution Time Trend */}
      <Card className="md:col-span-2 xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Execution Time (ms)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={timingData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="index" tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
              <Tooltip
                contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                labelFormatter={(v) => `Execution #${v}`}
              />
              <Line type="monotone" dataKey="time" stroke="#2563eb" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tool Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Tool Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Success vs Error per Tool */}
      {barData.length > 0 && (
        <Card className="md:col-span-2 xl:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Success vs Error by Tool</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="success" fill="#22c55e" name="Success" />
                <Bar dataKey="error" fill="#ef4444" name="Error" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ExecutionMetrics;
