import React from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import Carousel from './Carousel';
import { useState, useEffect } from 'react';
import "../styles/home.css";

const Home = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:8082/api/appointments/report/watchlist")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching carousel stats:", err);
        setLoading(false);
      });
  }, []);
  if(loading || !stats) return <div>Loading...</div>
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Vaccination Statistics Dashboard</h2>

      {!loading && stats && (
        <div style={{ marginTop: '3rem' }}>
          <Carousel
            genderData={stats.gender}
            ageData={stats.age}
            overallCoverage={stats.overallCoverage}
          />
        </div>
      )}
      <div className="chart-grid">
        <PieChart
          title="Gender Distribution"
          endpoint="http://localhost:8082/api/appointments/report/gender-distribution"
        />
        <PieChart
          title="Age Distribution"
          endpoint="http://localhost:8082/api/appointments/report/age-distribution"
        />
        <PieChart
          title="Percentage Vaccinated"
          endpoint="http://localhost:8082/api/appointments/report/population-covered"
        />
        <BarChart 
          title="Vaccine Distribution" 
          endpoint="http://localhost:8082/api/appointments/report/vaccine-distribution" 
        />
        <BarChart
          title="Vaccines by Date"
          endpoint="http://localhost:8082/api/appointments/report/doses-per-day"
        />

      </div>
    </div>
  );
};

export default Home;