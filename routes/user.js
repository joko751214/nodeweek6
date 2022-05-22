const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");
const upload = require("../utils/multer");

router.get("/profile", isAuth, handleErrorAsync(UserController.getUserInfo));
router.patch(
  "/profile",
  isAuth,
  upload.single("photo"),
  handleErrorAsync(UserController.updateUserInfo)
);
router.post("/sign_up", handleErrorAsync(UserController.signUp));
router.post("/sign_in", handleErrorAsync(UserController.signIn));
router.post(
  "/updatePassword",
  isAuth,
  handleErrorAsync(UserController.updatePassword)
);

module.exports = router;
