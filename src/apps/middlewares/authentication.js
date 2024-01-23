const { decryptedToken } = require("../../utils/token");
const { decrypt } = require("../../utils/crypt");

const verifyJwt = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader == undefined) {
    return res.status(401).json({ message: "Unset Token!" });
  }

  try {
    const { userId } = decryptedToken(authHeader).then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Invalid WebToken!" });
      }
      console.log(user.newId);
      req.userId = parseInt(decrypt(user.newId));
      return next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized!" });
  }
};
module.exports = verifyJwt;
