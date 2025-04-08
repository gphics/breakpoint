module.exports = (message, code = 400) => {
  const err = new Error(message);
  err.code = code;
  return err;
};
