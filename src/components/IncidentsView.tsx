import React, { useState, useEffect } from 'react';
import { Incident, IncidentSeverity, IncidentType } from '../types';
import { AlertTriangle, Plus, ShieldAlert, RefreshCw } from 'lucide-react';

export const IncidentsView: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [newLocation, setNewLocation] = useState('Aundh Road');
  const [newType, setNewType] = useState<IncidentType>('ACCIDENT');
  const [newSeverity, setNewSeverity] = useState<IncidentSeverity>('HIGH');
  const [newDesc, setNewDesc] = useState('');

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/incidents');
      const data = await res.json();
      setIncidents(data);
    } catch (e) {
      console.error('Failed to fetch incidents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreateIncident = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: newType,
          location: newLocation,
          severity: newSeverity,
          description: newDesc,
        }),
      });
      if (res.ok) {
        setShowModal(false);
        setNewDesc('');
        fetchIncidents();
      }
    } catch (e) {
      console.error('Failed to create incident:', e);
    }
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold font-mono text-slate-100 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>Traffic Incident Control Center</span>
          </h2>
          <p className="text-xs text-slate-400">Log and dispatch traffic accidents, road hazards, and emergency corridors</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-red-600 text-white text-xs font-mono font-bold flex items-center space-x-1.5 shadow-md shadow-amber-950"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Incident ID</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-slate-950/60 transition-colors">
                <td className="px-4 py-3 font-bold text-cyan-400">{inc.id}</td>
                <td className="px-4 py-3 text-slate-200">{inc.type}</td>
                <td className="px-4 py-3 font-medium text-slate-100">{inc.location}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inc.severity === 'CRITICAL'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : inc.severity === 'HIGH'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {inc.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-emerald-400">
                    {inc.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 max-w-xs truncate">{inc.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl font-mono text-xs text-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="font-bold text-slate-100">Report New Incident</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIncident} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 text-[10px] uppercase">Incident Category</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as IncidentType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200"
                >
                  <option value="ACCIDENT">ACCIDENT</option>
                  <option value="VEHICLE_BREAKDOWN">VEHICLE_BREAKDOWN</option>
                  <option value="ROAD_BLOCKAGE">ROAD_BLOCKAGE</option>
                  <option value="HEAVY_CONGESTION">HEAVY_CONGESTION</option>
                  <option value="EMERGENCY_VEHICLE_MOVEMENT">EMERGENCY_VEHICLE_MOVEMENT</option>
                  <option value="ROAD_CONSTRUCTION">ROAD_CONSTRUCTION</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-[10px] uppercase">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-[10px] uppercase">Severity</label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as IncidentSeverity)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-[10px] uppercase">Description</label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-slate-200 h-20"
                  placeholder="Describe lanes affected or emergency requirements..."
                  required
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 bg-slate-800 rounded text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-red-600 text-white font-bold rounded"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
