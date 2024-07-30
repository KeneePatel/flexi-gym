export interface Booking {
    id: number;
    customer: string;
    session: string;
    date: string;
    time: string;
  }
  
  export interface PopularClass {
    id: number;
    name: string;
    count: number;
  }
  
  export interface DashboardData {
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
  
  export default dummyData;
  