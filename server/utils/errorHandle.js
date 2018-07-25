module.exports = (err, location) => {
  console.log(`==================== ERROR CAUGHT ====================`);
  location !== undefined ? console.log(`^^^ LOCATION ^^^: ${location}`) : null;
  console.log(`NAME: ${err.name}`);
  console.log(`MESSAGE: ${err.message}`);
  console.log(`======================================================`);
};
