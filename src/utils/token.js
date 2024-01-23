const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const decryptedToken = async (authHeader) => {
  const [first, token] = authHeader.split(" ");
  try {
    return await promisify(jwt.verify)(token, process.env.HASH_BCRYPT);
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" &&
      error.message === "jwt malformed"
    ) {
      // Código para lidar com erro de token inválido
      console.error("Erro de token inválido:", error.message);

      return false;
    } else {
      // Outros erros
      console.error("Erro desconhecido ao verificar o token:", error.message);
    }
  }
};

module.exports = { decryptedToken };
