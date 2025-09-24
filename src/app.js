const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const driverRoutes = require('./routes/drivers');
const routeRoutes = require('./routes/routes');
const scheduleRoutes = require('./routes/schedule');
const { validateDriver, validateRoute, validateAssignment } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/drivers', validateDriver, driverRoutes);
app.use('/routes', validateRoute, routeRoutes);
app.use('/schedule', scheduleRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Route Scheduling System API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Endpoint not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;