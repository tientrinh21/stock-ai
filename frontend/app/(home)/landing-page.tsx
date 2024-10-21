"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowRight,
  BarChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Shield,
} from "lucide-react";
import Link from "next/link";

const demoChartData = [
  { date: "2023-01", value: 1000 },
  { date: "2023-02", value: 1200 },
  { date: "2023-03", value: 1100 },
  { date: "2023-04", value: 1300 },
  { date: "2023-05", value: 1500 },
  { date: "2023-06", value: 1400 },
];

export function LandingPage() {
  return (
    <div className="container flex flex-col">
      <section className="my-16 text-center">
        <h2 className="mb-4 text-4xl font-bold">
          Master the Market with StockTrade
        </h2>
        <p className="mb-8 text-xl text-muted-foreground">
          Powerful tools for smart investors. Start trading with confidence
          today.
        </p>
        <Link href="/register" passHref>
          <Button>
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>

      <section className="mb-16">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Market Data</CardTitle>
            <CardDescription>
              Stay updated with live stock prices and market trends
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ChartContainer
              config={{
                value: {
                  label: "Portfolio Value",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demoChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-value)"
                    fill="var(--color-value)"
                    fillOpacity={0.2}
                  />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16 grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="mr-2 h-6 w-6" />
              Advanced Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Gain insights with our powerful analytical tools and
              visualizations.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2 h-6 w-6" />
              Portfolio Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Easily manage and track your investments in one place.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-6 w-6" />
              Trading Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Access proven trading strategies to optimize your returns.</p>
          </CardContent>
        </Card>
      </section>

      <section className="mb-16 text-center">
        <h2 className="mb-8 text-3xl font-bold">Why Choose StockTrade?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <DollarSign className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Competitive Pricing</h3>
            <p>Low fees and competitive rates to maximize your profits.</p>
          </div>
          <div>
            <Shield className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Secure Platform</h3>
            <p>
              State-of-the-art security measures to protect your investments.
            </p>
          </div>
          <div>
            <TrendingUp className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold">Expert Support</h3>
            <p>Access to professional guidance and 24/7 customer support.</p>
          </div>
        </div>
      </section>

      <section className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold">Ready to Start Trading?</h2>
        <p className="mb-8 text-xl text-muted-foreground">
          Join thousands of successful investors on StockTrade today.
        </p>
        <Button size="lg">Create Your Free Account</Button>
      </section>
    </div>
  );
}