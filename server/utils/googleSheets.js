const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");
const makeRow = require("./makeRow");

// If modifying these scopes, delete credentials.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
const TOKEN_PATH = "./server/config/credentials.json";

const client_secret = require("./../config/client_secret.json");
const CRED = require("./../config/env.js");

async function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question("Enter the code from that page here: ", code => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

let getKeywords = async () => {
  return new Promise((resolve, reject) => {
    const keywords = [];
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(client_secret, auth => {
      const sheets = google.sheets({ version: "v4", auth });
      sheets.spreadsheets.values.get(
        {
          spreadsheetId: CRED.keywordSheetId,
          range: "B2:B1000"
        },
        (err, { data }) => {
          if (err) return console.log("The API returned an error: " + err);
          const rows = data.values;
          if (rows.length) {
            rows.map(row => {
              keywords.push(row[0]);
            });
          } else {
            console.log("No data found.");
          }
          // console.log("keys: " + keywords);
          return resolve(keywords);
        }
      );
    });
  });
};

let saveResults = async data => {
  console.log(`Saving ${data.length} lines to google sheets`);
  return new Promise((resolve, reject) => {
    // Authorize a client with credentials, then call the Google Sheets API.
    if (data) {
      authorize(client_secret, auth => {
        const sheets = google.sheets({ version: "v4", auth });

        sheets.spreadsheets.values.append(
          {
            spreadsheetId: CRED.writeSheetId,
            range: "Sheet1",
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: {
              values: data.map(makeRow)
            },
            auth: auth
          },
          (err, response) => {
            if (err) return console.error(err);
            // console.log(data.length + ' Lines saved');
            return resolve(response);
          }
        );
      });
    }
  });
};

module.exports = {
  getKeywords: getKeywords,
  saveResults: saveResults
};
