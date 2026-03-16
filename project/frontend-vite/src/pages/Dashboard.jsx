// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function Dashboard() {
//   const [incidents, setIncidents] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchIncidents = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get('https://final-year-project-okg4.onrender.com/api/incidents', {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setIncidents(res.data);
//       } catch (err) {
//         // handle error
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchIncidents();
//   }, []);

//   const total = incidents.length;
//   const suspicious = incidents.filter(i => i.status === 'SUSPICIOUS').length;
//   const recent = incidents.slice(0, 5);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//       <div className="flex gap-6 mb-8">
//         <div className="bg-white p-4 rounded shadow w-48 text-center">
//           <div className="text-xl font-bold">{total}</div>
//           <div>Total Incidents</div>
//         </div>
//         <div className="bg-white p-4 rounded shadow w-48 text-center">
//           <div className="text-xl font-bold text-red-600">{suspicious}</div>
//           <div>Suspicious</div>
//         </div>
//       </div>
//       <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
//       <table className="w-full bg-white rounded shadow mb-8">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Image</th>
//             <th className="p-2">Sender</th>
//             <th>Status</th>
//             <th>Confidence</th>
//             <th>Date</th>
//             <th>Details</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {recent.map(incident => (
//             <tr key={incident._id}>
//               <td className="p-2"><img src={incident.image} alt="Incident" className="h-12 w-12 object-cover rounded" /></td>
//               <td className="p-2">{incident.from || 'Unknown'}</td>
//               <td><span className={`px-2 py-1 rounded text-xs ${incident.status === 'SUSPICIOUS' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{incident.status}</span></td>
//               <td>{incident.confidence}%</td>
//               <td>{new Date(incident.reportedAt).toLocaleString()}</td>
//                <td><Link to={`/incidents/${incident._id}`} className="text-blue-600 hover:underline">View</Link></td>
//               <td>
//                 <div className="flex gap-2 items-center">
//                   {incident.actionTaken ? (
//                     <span className="text-green-600 font-semibold">Completed</span>
//                   ) : (
//                     <button
//                       className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
//                       onClick={async () => {
//                         const token = localStorage.getItem('token');
//                         await axios.patch(`/api/incidents/${incident._id}/action`, {}, {
//                           headers: { Authorization: `Bearer ${token}` }
//                         });
//                         setIncidents(incs => incs.map(i => i._id === incident._id ? { ...i, actionTaken: true } : i));
//                       }}
//                     >
//                       Action Taken
//                     </button>
//                   )}
//                   <button
//                     className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                     onClick={async () => {
//                       if(window.confirm('Are you sure you want to delete this incident?')) {
//                         const token = localStorage.getItem('token');
//                         await axios.delete(`/api/incidents/${incident._id}`, {
//                           headers: { Authorization: `Bearer ${token}` }
//                         });
//                         setIncidents(incs => incs.filter(i => i._id !== incident._id));
//                       }
//                     }}
//                   >
//                     Delete
//                   </button>------
//                 </div>
//               </td>
              
//             </tr>
//           ))}
//         </tbody>
//       </table>
//       <h2 className="text-xl font-semibold mb-4">All Incidents</h2>
//       <table className="w-full bg-white rounded shadow">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2">Image</th>
//             <th className="p-2">Sender</th>
//             <th>Status</th>
//             <th>Confidence</th>
//             <th>Date</th>
//             <th>Details</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {incidents.map(incident => (
//             <tr key={incident._id}>
//               <td className="p-2"><img src={incident.image} alt="Incident" className="h-12 w-12 object-cover rounded" /></td>
//               <td className="p-2">{incident.from || 'Unknown'}</td>
//               <td><span className={`px-2 py-1 rounded text-xs ${incident.status === 'SUSPICIOUS' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{incident.status}</span></td>
//               <td>{incident.confidence}%</td>
//               <td>{new Date(incident.reportedAt).toLocaleString()}</td>
//               <td><Link to={`/incidents/${incident._id}`} className="text-blue-600 hover:underline">View</Link></td>
//               <td>{incident.actionTaken === true ? (
//                   <span className="text-green-600 font-semibold">Completed</span>
//                 ) : (
//                   <span className="text-red-600 font-semibold">Pending</span>
//                 )}</td> 
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://final-year-project-okg4.onrender.com";

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://final-year-project-okg4.onrender.com/api/incidents", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncidents(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const total = incidents.length;
  const suspicious = incidents.filter(
    (i) => i.status === "SUSPICIOUS"
  ).length;
  const recent = incidents.slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-blue-800 p-8">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-slate-100">
          Admin Dashboard
        </h1>
        <p className="text-slate-300 mt-1">
          Monitor and manage reported incidents
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-100 rounded-2xl shadow p-6 border-l-4 border-slate-800 hover:scale-105 smooth-transition">
          <p className="text-sm text-slate-500">Total Incidents</p>
          <h2 className="text-3xl font-bold text-slate-800 mt-2">
            {total}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-500 hover:scale-105 smooth-transition">
          <p className="text-sm text-slate-500">Suspicious</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {suspicious}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-500 hover:scale-105 smooth-transition">
          <p className="text-sm text-slate-500">Solved</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {incidents.filter(i => i.actionTaken).length}
          </h2>
        </div>
      </div>

      {/* RECENT ALERTS */}
      <div className="bg-white rounded-2xl shadow mb-12">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-800">
            🚨 Recent Alerts
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 text-sm text-slate-600">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Sender</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Details</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((incident) => (
                <tr
                  key={incident._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={`${BASE_URL}${incident.image}`}
                      alt="Incident Image"
                      className="h-12 w-12 rounded-lg object-cover"
                      onError={() => console.log('Image failed to load:', `${BASE_URL}${incident.image}`)}
                    />
                  </td>

                  <td className="p-4 font-medium">
                    {incident.from || "Unknown"}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        incident.status === "SUSPICIOUS"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </td>

                  <td>{incident.confidence}%</td>
                  <td className="text-sm text-slate-500">
                    {new Date(incident.reportedAt).toLocaleString()}
                  </td>

                  <td>
                    <Link
                      to={`/incidents/${incident._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </td>

                  <td>
                    <div className="flex gap-2">
                      {incident.actionTaken ? (
                        <span className="text-green-600 font-semibold text-sm">
                          Completed
                        </span>
                      ) : (
                        <button
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700"
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            await axios.patch(
                              `/api/incidents/${incident._id}/action`,
                              {},
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            setIncidents((incs) =>
                              incs.map((i) =>
                                i._id === incident._id
                                  ? { ...i, actionTaken: true }
                                  : i
                              )
                            );
                          }}
                        >
                          Mark Done
                        </button>
                      )}

                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this incident?"
                            )
                          ) {
                            const token = localStorage.getItem("token");
                            await axios.delete(
                              `/api/incidents/${incident._id}`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );
                            setIncidents((incs) =>
                              incs.filter(
                                (i) => i._id !== incident._id
                              )
                            );
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ALL INCIDENTS */}
      <div className="bg-white rounded-2xl shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-slate-800">
            All Incidents
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 text-sm text-slate-600">
              <tr>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Sender</th>
                <th>Status</th>
                <th>Confidence</th>
                <th>Date</th>
                <th>Details</th>
                <th>State</th>
              </tr>
            </thead>

            <tbody>
              {incidents.map((incident) => (
                <tr
                  key={incident._id}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="p-4">
                    <img
                      src={`${BASE_URL}${incident.image}`}
                      alt="Incident Image"
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  </td>

                  <td className="p-4">
                    {incident.from || "Unknown"}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        incident.status === "SUSPICIOUS"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </td>

                  <td>{incident.confidence}%</td>
                  <td className="text-sm text-slate-500">
                    {new Date(incident.reportedAt).toLocaleString()}
                  </td>

                  <td>
                    <Link
                      to={`/incidents/${incident._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </Link>
                  </td>

                  <td>
                    {incident.actionTaken ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
