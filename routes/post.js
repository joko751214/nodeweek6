const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const PostController = require("../controllers/postController");
const handleErrorAsync = require("../service/handleErrorAsync");
const { isAuth } = require("../service/auth");

// 獲取全體動態牆資料
router.get("/", isAuth, handleErrorAsync(PostController.getPosts));

// 新增動態牆
router.post(
  "/",
  isAuth,
  upload.single("image"),
  handleErrorAsync(PostController.createPost)
);

router.delete("/", handleErrorAsync(PostController.deleteAll));

router.delete("/:id", handleErrorAsync(PostController.deletePost));

router.patch(
  "/:id",
  upload.single("image"),
  handleErrorAsync(PostController.updatePost)
);

module.exports = router;
