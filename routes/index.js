
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const tripRoute = require("./tripRoute");

const mountRoutes = (app) => {

  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/trips", tripRoute);
};

module.exports = mountRoutes;
