const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'SOAPAction', 'Accept'],
  exposedHeaders: ['Content-Type', 'SOAPAction'],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

// ... existing code ... 