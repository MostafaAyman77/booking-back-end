
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const tripRoute = require("./tripRoute");
const langRoute = require("./langRoute");

const mountRoutes = (app) => {

  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);
  app.use("/api/trips", tripRoute);
  app.use("/api/lang", langRoute);
};

module.exports = mountRoutes;
