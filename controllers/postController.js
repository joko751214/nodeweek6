const Post = require("../models/postModel");
const handleSuccess = require("../service/handlerSuccess");
const ImageController = require("./imageController");
const appError = require("../service/appError");

const post = {
  getPosts: async (req, res) => {
    const timeSort = req.query.timeSort === "asc" ? "createAt" : "-createAt";
    const keyword =
      req.query.keyword !== undefined
        ? { content: new RegExp(req.query.keyword) }
        : {};
    const data = await Post.find(keyword)
      .populate({
        path: "user",
        select: "name photo",
      })
      .sort(timeSort);
    handleSuccess(res, data);
  },

  createPost: async (req, res, next) => {
    const { content } = req.body;
    if (!content) return appError(400, "未填寫貼文內容", next);

    let image = "";
    if (req.file) {
      const { data } = await ImageController.uploadOneFile(req);
      image = data.link !== undefined ? data.link : "";
    }
    const data = await Post.create({
      user: req.user._id,
      image,
      content,
    });
    handleSuccess(res, data);
  },

  deleteAll: async (req, res) => {
    await Post.deleteMany({});
    handleSuccess(res, []);
  },

  deletePost: async (req, res, next) => {
    const id = req.params.id;
    const data = await Post.findByIdAndDelete(id);
    if (!data) return appError(400, "貼文 ID 有誤", next);
    handleSuccess(res, data);
  },

  updatePost: async (req, res, next) => {
    const { user, content } = req.body;
    if (!user) return appError(400, "缺少 user ID", next);
    if (!content) return appError(400, "未填寫貼文內容", next);

    let image = "";
    if (req.file) {
      const { data } = await ImageController.uploadOneFile(req);
      image = data.link !== undefined ? data.link : "";
    }

    const id = req.params.id;
    const data = await Post.findByIdAndUpdate(id, {
      image,
      user,
      content,
    });
    if (!data) return appError(400, "貼文 ID 有誤", next);
    handleSuccess(res, data);
  },
};

module.exports = post;
