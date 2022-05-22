const successHandle = (res, data = [], status = 200) => {
  res.json({
    status,
    data,
  });
};

module.exports = successHandle;
