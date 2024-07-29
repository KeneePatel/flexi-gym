"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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

interface DashboardData {
  totalBookings: number;
  totalEarnings: number;
  newBookings: Booking[];
  popularClasses: PopularClass[];
  monthlyEarnings: number[];
  monthlyBookings: number[];
}

const dummyData: DashboardData = {
  totalBookings: 120,
  totalEarnings: 5400,
  newBookings: [
    { id: 1, customer: "John Doe", session: "Yoga", date: "2024-06-01", time: "09:00" },
    { id: 2, customer: "Jane Smith", session: "Pilates", date: "2024-06-01", time: "10:00" },
  ],
  popularClasses: [
    { id: 1, name: "Yoga", count: 40 },
    { id: 2, name: "Pilates", count: 30 },
  ],
  monthlyEarnings: [500, 700, 1200, 900, 1300, 1100, 950, 1050, 1150, 1250, 1300, 1400],
  monthlyBookings: [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65],
};

const Dashboard = () => {
  const earningsChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Monthly Earnings",
        data: dummyData.monthlyEarnings,
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
      },
    ],
  };

  const bookingsChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [
      {
        label: "Monthly Bookings",
        data: dummyData.monthlyBookings,
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
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Gym Owner Dashboard</h1>
        <h2 className="text-2xl mt-2 text-gray-600">Overview</h2>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{dummyData.totalBookings}</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">${dummyData.totalEarnings}</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>New Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dummyData.newBookings.map((booking) => (
              <div key={booking.id} className="mb-4">
                <p className="text-lg font-medium">{booking.customer} - {booking.session}</p>
                <p className="text-gray-600">{booking.date} at {booking.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Popular Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dummyData.popularClasses.map((cls) => (
              <div key={cls.id} className="mb-4">
                <p className="text-lg font-medium">{cls.name} - {cls.count} bookings</p>
              </div>
            ))}
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

      <div className="text-center">
        <Button className="w-full">View More Details</Button>
      </div>
    </div>
  );
};

export default Dashboard;
