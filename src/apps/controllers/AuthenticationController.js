const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const Users = require("../models/Users");
const { encrypt } = require("../../utils/crypt");
class AuthenticationController {
  async authenticate(req, res) {
    const { email, user_name, password } = req.body;

    let whereClause = {};
    whereClause = email
      ? (whereClause = { email })
      : (whereClause = { user_name });

    const User = await Users.findOne({
      where: whereClause,
    });

    if (!User) {
      return res.status(401).json({ error: "User not found!" });
    }
    if (!User.checkPassword(password)) {
      return res.status(401).json({ error: "password don't match!" });
    }
    const { id, name } = User;
    const { iv, content } = encrypt(id);
    const newId = `${iv}:${content}`;
    const token = jwt.sign({ newId }, process.env.HASH_BCRYPT, {
      expiresIn: "7d",
    });

    return res.status(200).json({ User: { id, name }, token: token });
  }
}

module.exports = new AuthenticationController();
