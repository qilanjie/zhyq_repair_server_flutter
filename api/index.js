const login = require("./login");
const user = require("./user");
const repairOrder = require("./repairOrder");
const upload = require("./upload");
module.exports = (app) => {
  app.use(login);
  app.use(user);
  app.use(repairOrder);
  app.use(upload);
};
