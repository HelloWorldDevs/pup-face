module.exports = async (ms) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms)
  });
};