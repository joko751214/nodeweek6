const User = require("../models/userModel");
const handleSuccess = require("../service/handlerSuccess");
const appError = require("../service/appError");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { generateSendJWT } = require("../service/auth");
const ImageController = require("./imageController");

const user = {
  // 獲取個人資訊
  getUserInfo: async (req, res, next) => {
    handleSuccess(res, req.user);
  },
  // 更新個人資訊
  updateUserInfo: async (req, res, next) => {
    const { name, sex } = req.body;
    if (!name) return appError(400, "暱稱為必填", next);

    let photo = "";
    if (req.file) {
      const { data } = await ImageController.uploadOneFile(req);
      photo = data.link !== undefined ? data.link : "";
    }

    const data = await User.findByIdAndUpdate(req.user._id, {
      photo,
      name,
      sex,
    });
    handleSuccess(res, data);
  },
  // 註冊
  signUp: async (req, res, next) => {
    let { name, email, password } = req.body;
    console.log(req.body);
    if (!name || !email || !password) {
      return appError(400, "欄位未填寫正確", next);
    }
    if (!validator.isEmail(email)) {
      return appError(400, "Email 格式錯誤", next);
    }
    if (!validator.isLength(password, 8)) {
      return appError(400, "密碼長度最少 8 碼", next);
    }

    password = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email,
      password,
    });
    handleSuccess(res, {
      name: user.name,
      message: "註冊成功",
    });
    // generateSendJWT(user, 200, res);
  },
  // 登入
  signIn: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return appError(400, "帳號密碼不可為空", next);
    }

    if (!validator.isEmail(email)) {
      return appError(400, "Email 格式錯誤", next);
    }
    if (!validator.isLength(password, 8)) {
      return appError(400, "密碼長度最少 8 碼", next);
    }

    const user = await User.findOne({ email }).select("+password");
    const auth = await bcrypt.compare(password, user.password);

    if (!auth) {
      return appError(400, "您輸入的密碼有誤", next);
    }
    generateSendJWT(user, 200, res);
  },
  // 重設密碼
  updatePassword: async (req, res, next) => {
    let { password, confirmPassword } = req.body;
    if (!password || !confirmPassword)
      return appError(400, "密碼不能為空", next);
    if (password !== confirmPassword) return appError(400, "密碼不一致", next);

    const user = await User.findById(req.user._id).select("+password");
    const checkIsSame = await bcrypt.compare(password, user.password);
    if (checkIsSame) return appError(400, "密碼不能與舊的相同", next);

    password = await bcrypt.hash(password, 12);
    const data = await User.findByIdAndUpdate(req.user._id, {
      password,
    });
    handleSuccess(res, {
      name: user.name,
      message: "密碼設置成功",
    });
  },
};

module.exports = user;
