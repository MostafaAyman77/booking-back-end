
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");


const mountRoutes = (app) => {

  app.use("/api/auth", authRoute);
  app.use("/api/users", userRoute);

};

module.exports = mountRoutes;
