import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { store } from './server/store';
import { processMultiAgentWorkflow } from './server/agents/orchestratorAgent';
import { mcpServer } from './server/mcpServer';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // REST API v1 Endpoints

  // Health check
  app.get('/api/v1/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'CivicFlow AI Multi-Agent Traffic Intelligence',
      time: new Date().toISOString(),
      mcp_status: 'online',
    });
  });

  // KPI summary metrics
  app.get('/api/v1/kpis', (req, res) => {
    const incidents = store.getIncidents();
    const traffic = store.getTrafficSnapshots();
    const vehicles = store.getEmergencyVehicles();

    const activeIncidents = incidents.filter((i) => i.status === 'ACTIVE').length;
    const criticalIncidents = incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;

    // calculate avg congestion index
    const highCongestedRoads = traffic.filter((t) => t.congestion === 'HIGH' || t.congestion === 'CRITICAL').length;
    const enRouteVehicles = vehicles.filter((v) => v.status === 'EN_ROUTE').length;

    res.json({
      active_incidents: activeIncidents,
      critical_incidents: criticalIncidents,
      congestion_level: highCongestedRoads > 2 ? 'HIGH' : 'MODERATE',
      high_congested_corridors: highCongestedRoads,
      emergency_vehicles_en_route: enRouteVehicles,
      simulated_mode: true,
    });
  });

  // Analyze Query (Trigger Multi-Agent Workflow)
  app.post('/api/v1/analyze', async (req, res) => {
    try {
      const { query } = req.body;
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.status(400).json({ error: 'Valid query string is required' });
      }

      const sessionId = `SESSION_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      store.createSession(sessionId, query);

      // Async process workflow (non-blocking trigger for real-time progress, or wait for complete)
      processMultiAgentWorkflow(sessionId, query).catch((err) => {
        console.error('Workflow error:', err);
        store.updateSession(sessionId, { status: 'error' });
      });

      res.json({
        session_id: sessionId,
        status: 'processing',
        message: 'Multi-agent orchestration workflow started',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Session details
  app.get('/api/v1/sessions/:session_id', (req, res) => {
    const session = store.getSession(req.params.session_id);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
  });

  // Agent Events timeline
  app.get('/api/v1/sessions/:session_id/events', (req, res) => {
    const events = store.getEvents(req.params.session_id);
    res.json({
      session_id: req.params.session_id,
      event_count: events.length,
      events,
    });
  });

  // Recommendation for session
  app.get('/api/v1/sessions/:session_id/recommendation', (req, res) => {
    const rec = store.getRecommendationBySession(req.params.session_id);
    if (!rec) {
      return res.status(404).json({ error: 'Recommendation not found yet for this session' });
    }
    res.json(rec);
  });

  // Approve Recommendation
  app.post('/api/v1/recommendations/:id/approve', (req, res) => {
    const updated = store.updateRecommendationStatus(req.params.id, 'APPROVED');
    if (!updated) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    res.json({
      status: 'APPROVED',
      message: 'Recommendation approved by human operator. Simulated traffic signals updated.',
      recommendation: updated,
    });
  });

  // Reject Recommendation
  app.post('/api/v1/recommendations/:id/reject', (req, res) => {
    const updated = store.updateRecommendationStatus(req.params.id, 'REJECTED');
    if (!updated) {
      return res.status(404).json({ error: 'Recommendation not found' });
    }
    res.json({
      status: 'REJECTED',
      message: 'Recommendation rejected by human operator and logged to audit trail.',
      recommendation: updated,
    });
  });

  // Incidents
  app.get('/api/v1/incidents', (req, res) => {
    res.json(store.getIncidents());
  });

  app.post('/api/v1/incidents', (req, res) => {
    const { type, location, lat, lng, severity, description } = req.body;
    const newInc = store.addIncident({
      id: `INC_${Date.now().toString(36).toUpperCase()}`,
      type: type || 'ACCIDENT',
      location: location || 'Aundh Road',
      lat: lat || 18.558,
      lng: lng || 73.807,
      severity: severity || 'HIGH',
      status: 'ACTIVE',
      description: description || 'Operator manually reported incident',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    res.status(201).json(newInc);
  });

  // Traffic snapshots
  app.get('/api/v1/traffic/:location', (req, res) => {
    const traffic = store.getTrafficForLocation(req.params.location);
    if (!traffic) {
      return res.json(mcpServer.getTrafficStatus(req.params.location));
    }
    res.json(traffic);
  });

  app.get('/api/v1/traffic', (req, res) => {
    res.json(store.getTrafficSnapshots());
  });

  // Emergency Vehicles
  app.get('/api/v1/emergency-vehicles', (req, res) => {
    res.json(store.getEmergencyVehicles());
  });

  // Vite Middleware integration for SPA dev / prod static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CivicFlow AI Traffic Command Center Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CivicFlow AI server:', err);
});
