const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
require("dotenv").config({ path: "./config.env" });
const cors = require("cors");

// 補捉程式錯誤
process.on("uncaughtException", (err) => {
  // 記錄錯誤下來，等到服務都處理完後，停掉該 process
  console.error("Uncaughted Exception！");
  console.error(err);
  process.exit(1);
});

const app = express();

require("./connections");

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/posts", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  errorHandle(res, 404, "無此網站路由");
});

const { resErrorDev, resErrorProd } = require("./service/resError");

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === "dev") return resErrorDev(err, res);
  resErrorProd(err, res);
  // errorHandle(res, 500, "系統異常");
});

// 未捕捉到的 catch
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕捉到的 rejection：", promise, "原因：", reason);
  // 記錄於 log 上
});

module.exports = app;
