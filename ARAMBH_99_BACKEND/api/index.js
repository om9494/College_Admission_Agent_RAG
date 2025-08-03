require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/authRoutes");
const adminauthRoutes = require("../routes/adminauthRoutes");
const collegeRoutes = require("../routes/collegeRoutes");
const dteauthRoutes = require("../routes/dteauthRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const compression = require('compression');


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ['https://arambh-99.vercel.app', 'http://localhost:5173']; // Replace with your frontend's URL in production


const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) { // Allow requests with no origin or from allowed origins
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


// Middleware
app.use(compression());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminauthRoutes);
app.use("/college", collegeRoutes);
app.use("/dte", dteauthRoutes);
app.use("/notification", notificationRoutes);


// Handle unhandled routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit process if database connection fails
  });

// Server initialization
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

module.exports = app;