const {google} = require('googleapis');
const debug = require('debug')('gmail:users');

module.exports = {
  listLabels,
  listMessages,
  getMessage,
  deleteMessage,
  getMessageHeaderValueByName,
  getMessageFromHeader,
  isMessageSenderBlocked
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels({auth}, cb) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) {
      debug('The API returned an error: ' + err);
      return cb(err);
    }
    const labels = res.data.labels;
    if (labels.length) {
      debug('Labels:');
      labels.forEach((label) => {
        debug(`${label.id}- ${label.name}`);
      });
      cb(undefined, labels);
    } else {
      debug('No labels found.');
      cb();
    }
  });
}

function listMessages({auth, labelIds = []}, cb) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.messages.list({
    userId: 'me',
    labelIds,
    includeSpamTrash: true
  }, (err, res) => {
    if (err) {
      debug('The API returned an error: ' + err);
      return cb(err);
    }
    const messages = res.data.messages;
    if (messages && messages.length) {
      debug('Messages:');
      messages.forEach((message) => {
        debug(message);
      });
      cb(undefined, messages);
    } 
    else {
      debug('No messages found.');
      cb();
    }
  });
}

function getMessage({auth, id}, cb) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.messages.get({
    id,
    userId: 'me',
  }, (err, res) => {
    if (err) {
      debug('The API returned an error: ' + err);
      return cb(err);
    }
    const data = res.data;
    if(data) {
      debug(data);
      cb(undefined, data);
    } 
    else {
      debug('No message found.');
      cb();
    }
  });
}

function deleteMessage({auth, id}, cb) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.messages.delete({
    id,
    userId: 'me',
  }, (err, res) => {
    if (err) {
      debug('The API returned an error: ' + err);
      return cb(err);
    }
    if(res) {
      debug(res);
      cb(undefined, res);
    } 
    else {
      debug('No message found.');
      cb();
    }
  });
}


function getMessageHeaderValueByName({message, headerName}, cb) {
  let i, header, found = false;
  for (i in message.payload.headers) {
    header = message.payload.headers[i];
    if (header.name == headerName) {
      found = header.value;
      break;
    }
  }
  cb(undefined, found);
}

function getMessageFromHeader({message}, cb) {
  return getMessageHeaderValueByName({message, headerName: "From"}, cb);
}

function isMessageSenderBlocked({fromHeader, blockedAddresses}, cb) {
  let j, found = false;
  for (j in blockedAddresses) {
    if (fromHeader.includes(blockedAddresses[j])) {
      found = true;
      break;
    }
  }
  cb(undefined, found);
}
