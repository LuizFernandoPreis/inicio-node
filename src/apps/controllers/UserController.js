const Users = require("../models/Users");
const bcryptjs = require("bcryptjs");
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
  async update(req, res) {
    const {
      name,
      avatar,
      bio,
      gender,
      old_password,
      new_password,
      confirm_new_password,
    } = req.body;

    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exists!" });
    }
    let encryptedPassword = "";

    if (old_password) {
      if (!(await user.checkPassword(old_password))) {
        return res.status(401).json({ error: "Old Password don't match!" });
      }
      if (!new_password || !confirm_new_password) {
        return res.status(401).json({
          error:
            "We need a new password and a confirm_new_password attributes!",
        });
      }
      if (new_password != confirm_new_password) {
        return res.status(401).json({
          error: "New password and confirm_new_password doesn't match",
        });
      }

      encryptedPassword = await bcryptjs.hash(new_password, 8);
    }
    await Users.update(
      {
        name: name || user.name,
        avatar: avatar || user.avatar,
        bio: bio || user.bio,
        gender: gender || user.gender,
        password_hash: encryptedPassword || user.password_hash,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return res.status(200).json({ message: "User updated!" });
  }
  async delete(req, res) {
    const userToDelete = Users.findOne({
      where: {
        id: req.userId,
      },
    });
    if (!userToDelete) {
      return res.status(400).json({ error: "User doesn't exist!" });
    }
    await Users.destroy({
      where: {
        id: req.userId,
      },
    });

    return res.status(200).json({ message: "User deleted" });
  }
  async userProfile(req, res) {
    const user = await Users.findOne({
      attributes: [
        "id",
        "name",
        "user_name",
        "email",
        "avatar",
        "bio",
        "gender",
      ],
      where: {
        id: req.userId,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "User doesn't exist!" });
    }
    return res.status(200).json({ message: user });
  }
}

module.exports = new UserController();
