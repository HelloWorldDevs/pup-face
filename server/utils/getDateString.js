module.exports = (date) => {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(2)}`
};