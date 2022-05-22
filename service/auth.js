const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "./config.env" });
const appError = require("../service/appError");
const User = require("../models/userModel");

// 產生 Token
const generateSendJWT = (user, status, res) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  res.json({
    status,
    user: {
      name: user.name,
      token,
    },
  });
};

// 驗證是否帶有 Token
const isAuth = async (req, res, next) => {
  // 1. 驗證 headers 是否帶有 Token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return appError(400, "您尚未登入", next);

  // 2. 核對 token 是否正確
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) reject(err);
      else resolve(payload);
    });
  });
  // 3. 查找 user 資料，並將其傳遞下去
  const currentUser = await User.findById(decoded.id);
  console.log(currentUser, "currentUser");
  req.user = currentUser;
  next();
};

module.exports = { generateSendJWT, isAuth };
