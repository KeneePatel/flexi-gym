"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProtectedRoute from "../../../Auth/ProtectedRoutes";
import { getProfileData } from "../../../Auth/AuthService";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Booking {
  id: number;
  customer: string;
  session: string;
  date: string;
  time: string;
}

interface PopularClass {
  id: number;
  name: string;
  count: number;
}

interface User {
  _id: string;
  id: any;
  gymName: any;
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard = () => {
  const [bookings, setBookings] = useState<number>(0);
  const [monthlyBookings, setMonthlyBookings] = useState([]);
  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [earnings, setEarnings] = useState<number>(0);
  const [users, setUsers] = useState<User[] | null>([]);

  const user = getProfileData() as User | undefined;
  const id = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, earningsRes, usersRes, monthEarnRes, monthBookRes] =
          await Promise.all([
            fetch(process.env.NEXT_PUBLIC_API_URL + "/totalBookings/" + id),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/totalEarnings/" + id),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/totalBookedUsers/" + id),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/monthlyEarnings/" + id),
            fetch(process.env.NEXT_PUBLIC_API_URL + "/monthlyBookings/" + id),
          ]);

        const bookingsData = await bookingsRes.json();
        const earningsData = await earningsRes.json();
        const usersData = await usersRes.json();
        const monthlyEarningData = await monthEarnRes.json();
        const monthlyBookData = await monthBookRes.json();

        setBookings(bookingsData);
        setEarnings(earningsData);
        setUsers(usersData.users);
        setMonthlyBookings(monthlyBookData);
        setMonthlyEarnings(monthlyEarningData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const earningsChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Earnings",
        data: monthlyEarnings,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const bookingsChartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Bookings",
        data: monthlyBookings,
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: true,
      },
      y: {
        display: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-primary-foreground p-6">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary-foreground">
            {user?.gymName} Dashboard
          </h1>
          <h2 className="text-2xl mt-2 text-secondary-foreground">Overview</h2>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">{bookings}</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold">${earnings}</p>
            </CardContent>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>New Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 ">
              {users == 0 ? (
                <>
                <p>No users have booked your gym yet</p>
                </>
              ) : (
                <>
                {users?.map((user) => (
                  <div
                    key={user._id}
                    className="mb-4 hover:bg-secondary p-2 rounded-lg"
                  >
                    <p className="text-md ">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                ))}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="earnings" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="earnings">
            <Card className="w-full mb-6">
              <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <Line data={earningsChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card className="w-full mb-6">
              <CardHeader>
                <CardTitle>Monthly Bookings</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <Line data={bookingsChartData} options={chartOptions} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
