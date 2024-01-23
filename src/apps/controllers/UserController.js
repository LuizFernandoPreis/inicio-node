const Users = require("../models/Users");

class UserController {
  async create(req, res) {
    const verifyEmail = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    const verifyUser = await Users.findOne({
      where: {
        user_name: req.body.user_name,
      },
    });
    if (verifyEmail) {
      return res.status(400).json({ message: "Email already exist!" });
    }
    if (verifyUser) {
      return res.status(400).json({ message: "UserName already exist!" });
    }

    const User = await Users.create(req.body);
    if (!User) {
      return res.status(400).json({ message: "Failed to create user!" });
    }
    return res.send({ users: "User created!" });
  }
}

module.exports = new UserController();
