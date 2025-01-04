"use client";

import React from "react";
import { motion } from "framer-motion";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ThumbsUp, Share2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, percentage }: {
  title: string;
  value: string;
  icon: React.ReactNode;
  percentage: number;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <Card className="bg-card/50 backdrop-blur-xl border-primary/10">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentage > 0 ? '+' : ''}{percentage}% from last month
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

export default function AnalyticsPage() {
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Visitors',
        data: [65000, 72000, 81000, 95000, 105000, 125000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const engagementData = {
    labels: ['Stories', 'Comments', 'Shares', 'Likes'],
    datasets: [
      {
        label: 'Engagement Metrics',
        data: [4500, 3200, 2100, 5600],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 211, 238, 0.8)',
        ],
      },
    ],
  };

  return (
    <ScrollArea className="h-full">
    <div className="min-h-screen p-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold text-primary">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor your site's performance and engagement</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="25,431"
          icon={<Users className="text-primary" />}
          percentage={12.5}
        />
        <StatCard
          title="Total Stories"
          value="5,283"
          icon={<BookOpen className="text-primary" />}
          percentage={8.2}
        />
        <StatCard
          title="Total Likes"
          value="142.5K"
          icon={<ThumbsUp className="text-primary" />}
          percentage={15.8}
        />
        <StatCard
          title="Total Shares"
          value="23.8K"
          icon={<Share2 className="text-primary" />}
          percentage={-2.4}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-card/50 backdrop-blur-xl border-primary/10">
            <CardHeader>
              <CardTitle>Monthly Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <Line
                data={monthlyData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="bg-card/50 backdrop-blur-xl border-primary/10">
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Bar
                data={engagementData}
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                      },
                    },
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Popular Categories */}
        <Card className="bg-card/50 backdrop-blur-xl border-primary/10">
          <CardHeader>
            <CardTitle>Popular Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Romance", count: "1.2K stories", percentage: 28 },
              { name: "Mystery", count: "856 stories", percentage: 22 },
              { name: "Science Fiction", count: "643 stories", percentage: 18 },
            ].map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{category.name}</span>
                  <span className="text-muted-foreground">{category.count}</span>
                </div>
                <div className="h-2 bg-primary/20 rounded-full">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.percentage}%` }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card/50 backdrop-blur-xl border-primary/10">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: "New story published", time: "2 minutes ago" },
                { action: "User milestone reached", time: "1 hour ago" },
                { action: "New feature launched", time: "3 hours ago" },
                { action: "System update", time: "5 hours ago" },
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-3 bg-primary/5 rounded-lg"
                >
                  <span>{activity.action}</span>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Demographics */}
        <Card className="bg-card/50 backdrop-blur-xl border-primary/10">
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { age: "18-24", percentage: 35 },
                { age: "25-34", percentage: 45 },
                { age: "35-44", percentage: 15 },
                { age: "45+", percentage: 5 },
              ].map((demo, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Age {demo.age}</span>
                    <span>{demo.percentage}%</span>
                  </div>
                  <motion.div
                    className="h-2 bg-primary/20 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${demo.percentage}%` }}
                      className="h-full bg-primary rounded-full"
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </ScrollArea>
  );
}
