const { Router } = require("express");
const { upload } = require("./configs/multer");
const UserController = require("./apps/controllers/UserController");
const FileController = require("./apps/controllers/FileController");
const AuthenticationController = require("./apps/controllers/AuthenticationController");
const schemaValidator = require("./apps/middlewares/schemaValidator");
const userSchema = require("./schemas/create.user.schema.json");
const AuthenticationMiddleware = require("./apps/middlewares/authentication");
const PostController = require("./apps/controllers/PostController");
const postCreateSchema = require("./schemas/post.schema copy.json");
const routes = new Router();

routes.post("/user", schemaValidator(userSchema), UserController.create);

routes.post("/auth", AuthenticationController.authenticate, () => {});

routes.use(AuthenticationMiddleware);

routes.put("/user", UserController.update);

routes.delete("/user", UserController.delete);

routes.get("/health", (req, res) => {
  return res.send({ message: "Connected with success!" });
});

routes.get("/user-profile", UserController.userProfile);

routes.post("/upload", upload.single("image"), FileController.upload);

routes.post("/post", schemaValidator(postCreateSchema), PostController.create);

routes.delete("/post/:id", PostController.delete);

module.exports = routes;
