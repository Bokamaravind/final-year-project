
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function IncidentDetail() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const BASE_URL = "https://final-year-project-okg4.onrender.com";
  useEffect(() => {
    const fetchIncident = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`https://final-year-project-okg4.onrender.com/api/incidents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIncident(res.data);
    };
    fetchIncident();
  }, [id]);

  if (!incident) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 to-blue-800 p-8">
      <div className="max-w-2xl mx-auto bg-white backdrop-blur-sm rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Incident Details</h1>
        <div className='w-full h-64'>
        <img src={`${BASE_URL}${incident.image}`} alt="Incident" className="w-full h-full object-contain rounded mb-4" />
        </div>
        <div className='mb-2'><span className="font-semibold">Sender:</span> {incident.from || 'Unknown'}</div>
        <div className="mb-2"><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded text-xs ${incident.status === 'SUSPICIOUS' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{incident.status}</span></div>
        <div className="mb-2"><span className="font-semibold">Confidence:</span> {incident.confidence}%</div>
        <div className="mb-2"><span className="font-semibold">Date:</span> {new Date(incident.reportedAt).toLocaleString()}</div>
        {incident.location && incident.location.latitude && incident.location.longitude && (
          <div className="mb-2">
            <span className="font-semibold">Location:</span>
            <iframe
              title="Google Maps"
              width="100%"
              height="250"
              style={{ border: 0, marginTop: '8px' }}
              loading="lazy"
              allowFullScreen
              src={`https://maps.google.com/maps?q=${incident.location.latitude},${incident.location.longitude}&z=15&output=embed`}
            />
          </div>
        )}
        <div className="mb-2"><span className="font-semibold">Explanation:</span> {incident.explanation}</div>
        {incident.pdf && (
          <a href={incident.pdf} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Download PDF</a>
        )}
      </div>
    </div>
  );
}

export default IncidentDetail;
