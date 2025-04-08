module.exports = (size) => {
  if (!size) return false;
  const limitMb = 10.5;
  const sizeMb = size / 1024 / 1024;
  return limitMb >= sizeMb;
};
