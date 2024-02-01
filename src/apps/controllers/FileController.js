require("dotenv").config();

const B2 = require("backblaze-b2");
const fsp = require("fs/promises");

const { APPLICATIONKEY, APPLICATIONKEYID, BUCKETID, URLFILE } = process.env;

const b2 = new B2({
  applicationKey: APPLICATIONKEY,
  applicationKeyId: APPLICATIONKEYID,
});

const unlink = fsp.unlink;

class FileController {
  async upload(req, res) {
    const { filename, path } = req.file;

    try {
      const fileData = await fsp.readFile(`uploads/${filename}`);

      await b2.authorize();

      const {
        data: { uploadUrl, authorizationToken },
      } = await b2.getUploadUrl({
        bucketId: BUCKETID,
      });

      const { data } = await b2.uploadFile({
        uploadUrl: uploadUrl,
        uploadAuthToken: authorizationToken,
        fileName: filename,
        data: fileData,
      });

      await unlink(path);

      return res.status(200).json({
        url: `${URLFILE}${data.fileName}`,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = new FileController();
