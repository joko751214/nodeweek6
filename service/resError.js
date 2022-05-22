const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    err: err,
    message: err.message,
    stack: err.stack,
  });
};

const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else if (err.status !== 500 && err.name === "SyntaxError") {
    res.status(err.status).json({
      status: err.status,
      message: "格式錯誤",
    });
  } else {
    // log 紀錄
    console.error("出現重大錯誤", err);
    // 送出罐頭預設訊息
    res.status(500).json({
      status: "error",
      message: "系統錯誤，請恰系統管理員",
    });
  }
};

module.exports = { resErrorDev, resErrorProd };
