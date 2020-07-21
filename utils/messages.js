const moment = require("moment");

formatMessage = (username, message) => {
  let time = moment().format("LT");
  return `${username} : ${message}`;
};

module.exports = {
  formatMessage,
};
