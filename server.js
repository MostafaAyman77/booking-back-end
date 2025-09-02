const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

require('dotenv').config();

const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
const mountRoutes = require("./routes");

// connect with database
dbConnection();

// express app
const app = express();

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json({ limit: '20kb' }));
// app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
mountRoutes(app);

// Handle undefined routes (Express 5 compatible)
app.use((req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 404));
});

// Global Error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App Running on port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection Errors: ${err.name} | ${err.message}`);
    server.close(() => {
        console.error(`Shutting down.....`);
        process.exit(1);
    });
});
