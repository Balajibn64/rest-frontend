import React, { useEffect, useState } from 'react';
import '../../styles/dashboard.css';

// ✅ Mock API (replace this with real API call later)
const getRestaurantDashboardStats = async () => {
  return {
    data: {
      todayOrders: 27,
      todayRevenue: 5640,
      pendingOrders: 3,
      topDishes: [
        { name: 'Chicken Biryani', count: 14 },
        { name: 'Paneer Tikka', count: 8 },
      ],
    },
  };
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    topDishes: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getRestaurantDashboardStats(); // 🔁 Mock/Real API
        setStats(res.data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p className="dashboard-loading">Loading dashboard...</p>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">📊 Dashboard Overview</h2>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Orders Today</h3>
          <p>{stats.todayOrders}</p>
        </div>
        <div className="card">
          <h3>Revenue Today</h3>
          <p>₹ {stats.todayRevenue}</p>
        </div>
        <div className="card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
      </div>

      <div className="top-dishes-section">
        <h3>🔥 Top Dishes</h3>
        <ul>
          {stats.topDishes.map((dish, index) => (
            <li key={index}>
              {dish.name} — <span>{dish.count} orders</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
