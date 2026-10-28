require('dotenv').config();

const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const scoreRoutes = require('./routes/score');

const app = express();
const port = Number(process.env.PORT) || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/tasks', taskRoutes);
app.use('/score', scoreRoutes);

app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }
  if (err && err.message === 'Origin is not allowed by CORS') {
    return res.status(403).json({ error: err.message });
  }
  return next(err);
});

if (require.main === module) {
  app.listen(port, () => console.log('TaskNest API listening on port ' + port));
}

module.exports = app;
