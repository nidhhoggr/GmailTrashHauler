const debug = require('debug')('gmail:main');
const promisifyAll = require('./services/promisifyAll');
const gmailAuthAsync = promisifyAll(require('./modules/auth'));
const gmailUsersAsync = promisifyAll(require('./modules/users'));
const config = require('./config/config');
const getopts = require("getopts");

var auth;

(async () => {
  auth = await gmailAuthAsync.getAuthAsync();
  const options = getopts(process.argv.slice(2), {
    alias: {
      l: "list",
      x: "purge"
    }
  });
  if (options.list) {
    getLabels();
  }
  else if(options.purge) {
    haulTrash();
  }
  else {
    console.log("Usage:\n\n\tList labels: \n\n\t\tnode index.js -l\n\n\tHaul the trash: \n\n\t\tnode index.js -x\n\n\n\tDebug:\n\n\t\tDEBUG=gmail:* node index.js [FLAG]");
  }
})();

async function getLabels() {
  const labels = await gmailUsersAsync.listLabelsAsync({auth});
  console.log(labels);
}

async function haulTrash() {
  const trashMessages = await gmailUsersAsync.listMessagesAsync({
    auth,
    labelIds: config.scannableLabels
  });
  let i, trashMessage, fromHeader, messageId, deleteResult;
  for (i in trashMessages) {
    messageId = trashMessages[i].id;
    trashMessage = await gmailUsersAsync.getMessageAsync({auth, id: messageId});
    fromHeader = await gmailUsersAsync.getMessageFromHeaderAsync({message: trashMessage});
    const isBlocked = await gmailUsersAsync.isMessageSenderBlockedAsync({fromHeader, blockedAddresses: config.blockedAddresses});
    if (isBlocked) {
      debug("Blocked Email:", fromHeader);
      try {
        deleteResult = await gmailUsersAsync.deleteMessageAsync({auth, id: messageId});
        debug(deleteResult);
      } catch (err) {
        debug(err);
      }
    }
  }
}
