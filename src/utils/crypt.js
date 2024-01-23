const crypto = require("crypto");
const algoritimo = "aes-256-ctr";
const secretKey = process.env.SECRET_CRYPTO;
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
  const cypher = crypto.createCipheriv(algoritimo, secretKey, iv);

  const encrypted = Buffer.concat([
    cypher.update(text.toString()),
    cypher.final(),
  ]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

const decrypt = (hash) => {
  const [newIv, text] = hash.split(":");
  const decipher = crypto.createDecipheriv(
    algoritimo,
    secretKey,
    Buffer.from(newIv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(text, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
