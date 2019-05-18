const fs = require('fs');
const {google} = require('googleapis');
const debug = require('debug')('gmail:auth');

const TOKEN_PATH = __dirname + '/../config/token.json';

module.exports = {
  getAuth: authorizeFromFile
}


function authorizeFromFile(cb) {
  fs.readFile(__dirname + '/../config/creds.json', (err, content) => {
    if (err) {
      debug('Error loading client secret file:', err);
      return cb(err);
    }
    // Authorize a client with credentials, then call the Gmail API.
    const credentials = JSON.parse(content);
    authorize({credentials}, cb);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize({credentials}, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return cb(err);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(undefined, oAuth2Client);
  });
}
