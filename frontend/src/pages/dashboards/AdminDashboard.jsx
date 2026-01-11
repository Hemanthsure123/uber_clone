import { useEffect, useState } from "react";
import axios from "../../api/axios";

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchDrivers = async () => {
    const res = await axios.get("/admin/drivers", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setDrivers(res.data);
  };

  const approve = async (id) => {
    await axios.patch(
      `/admin/driver/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    fetchDrivers();
  };

  const reject = async (id) => {
    await axios.patch(
      `/admin/driver/${id}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    fetchDrivers();
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <>
      <h1>Admin Dashboard</h1>

      {drivers.length === 0 && <p>No pending drivers</p>}

      {drivers.map((d) => (
        <div key={d._id} style={{ border: "1px solid #ccc", margin: 10 }}>
          <img src={d.selfieUrl} width="120" />
          <p>Name: {d.fullName}</p>
          <p>Email: {d.userId.email}</p>
          <p>License: {d.licenseNumber}</p>
          <p>Vehicle: {d.vehicle.brand} {d.vehicle.model}</p>

          <button onClick={() => approve(d._id)}>Approve</button>
          <button onClick={() => reject(d._id)}>Reject</button>
        </div>
      ))}
    </>
  );
}
