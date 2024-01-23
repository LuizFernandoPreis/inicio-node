const { Router } = require("express");
const UserController = require("./apps/controllers/UserController");
const AuthenticationController = require("./apps/controllers/AuthenticationController");
const schemaValidator = require("./apps/middlewares/schemaValidator");
const userSchema = require("./schemas/create.user.schema.json");
const AuthenticationMiddleware = require("./apps/middlewares/authentication");
const routes = new Router();

routes.post("/user", schemaValidator(userSchema), UserController.create);

routes.post("/auth", AuthenticationController.authenticate, () => {
  console.log(1);
});

routes.use(AuthenticationMiddleware);

routes.put("/user", UserController.update);

routes.delete("/user", UserController.delete);

routes.get("/health", (req, res) => {
  return res.send({ message: "Connected with success!" });
});

routes.get("/user-profile", UserController.userProfile);

module.exports = routes;
