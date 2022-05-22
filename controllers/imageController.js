require("dotenv").config({ path: "./config.env" });
// imgur 圖片上傳服務
const { ImgurClient } = require("imgur");
const client = new ImgurClient({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN,
});

const image = {
  uploadOneFile: async (req) => {
    const response = await client.upload({
      image: req.file.buffer,
      title: req.file.name,
      type: "file",
      album: req.file.album,
    });
    return response;
  },
};

module.exports = image;
