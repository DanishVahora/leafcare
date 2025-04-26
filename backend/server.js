const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const helmet = require("helmet");
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const { setupScheduledTasks } = require('./utils/scheduledTasks');
const userRoutes = require('./routes/userRoutes');
const historyRoutes = require('./routes/historyRoutes');

// Load env vars

// Load environment variables
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Middleware


app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174","https://leafcare-production.up.railway.app"], // Allow both ports
  credentials: true, 
  allowedHeaders: [
    "Content-Type", 
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["set-cookie"]

}));

app.options('*', cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Allow popups
      crossOriginEmbedderPolicy: false // Disable to prevent iframe issues
    })
  );

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/users', userRoutes); // Add this line
app.use('/api/history', historyRoutes);

// Set up scheduled tasks
setupScheduledTasks();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));