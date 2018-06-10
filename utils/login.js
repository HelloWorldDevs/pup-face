module.exports = async (page) => {
  const ID = {
    login: '#email',
    pass: '#pass'
  };
  const CRED = require('./../creds.js');
  const sleep = require('./sleep');

  // login
  await page.goto('https://facebook.com', {
    waitUntil: 'networkidle2'
  });
  await page.waitForSelector(ID.login);
  console.log(CRED.user);
  console.log(ID.login);
  await page.type(ID.login, CRED.user);
  await page.type(ID.pass, CRED.pass);
  await sleep(500);
  await page.click("#loginbutton");
  console.log("login done");
  await page.waitForNavigation();
  return page;
};
