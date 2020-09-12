const colors = require("colors");
module.exports = function (logMessage, type = "info") {
  let logString;
  let logFormatting;

  switch (type) {
    case "debug":
      logString = colors.white(logMessage);
      logFormatting = colors.bgMagenta(colors.red(colors.bold("[ DEBUG ]")));
      break;
    case "info":
      logString = colors.white(logMessage);
      logFormatting = colors.white(colors.bold("[ INFO ]"));
      break;
    case "warn":
      logString = colors.white(logMessage);
      logFormatting = colors.black(colors.bold("[ WARNING ]"));
      break;
    case "critical":
      logString = colors.bgRed(colors.white(logMessage));
      logFormatting = colors.bgRed(colors.white(colors.bold("[ CRITICAL ]")));
      break;
    case "success":
      logString = colors.green(logMessage);
      logFormatting = colors.bgGreen(colors.black(colors.bold("[ SUCCESS ]")));
      break;
    case "eventupdated":
      logString = colors.green(logMessage);
      logFormatting = colors.bgGreen(colors.black(colors.bold("[ EVENT UPDATE SUCCESS ]")));
      break;
    case "eventupdating":
      logString = colors.green(logMessage);
      logFormatting = colors.black(colors.bold("[ EVENT UPDATING ]"));
      break;
    case "commandupdate":
      logString = colors.green(logMessage);
      logFormatting = colors.bgGreen(colors.black(colors.bold("[ COMMAND UPDATE SUCCESS ]")));
      break;
    case "commandupdating":
      logString = colors.green(logMessage);
      logFormatting = colors.black(colors.bold("[ COMMAND UPDATING ]"));
      break;
    case "cmdused":
      logString = colors.white(logMessage);
      logFormatting = colors.bgMagenta(colors.white(colors.bold("[ COMMAND USED ]")));
      break;
    case "noguild":
      logString = colors.bgRed(colors.white(logMessage));
      logFormatting = colors.bgRed(colors.white(colors.bold("[ NO GUILD FOUND ]")));
      break;
    case "joinguild":
      logString = colors.white(logMessage);
      logFormatting = colors.bgGreen(colors.black(colors.bold("[ JOINED GUILD ]")));
      break;
    case "leftguild":
      logString = colors.white(logMessage);
      logFormatting = colors.bgYellow(colors.black(colors.bold("[ LEFT GUILD ]")));
      break;
    case "newuser":
      logString = colors.white(logMessage);
      logFormatting = colors.bgGreen(colors.black(colors.bold("[ NEW USER ]")));
      break;
    case "userleft":
      logString = colors.white(logMessage);
      logFormatting = colors.bgYellow(colors.black(colors.bold("[ USER LEFT ]")));
      break;
    default:
      logString = colors.white(logMessage);
      logFormatting = colors.white(colors.bold("[ INFO ]"));
      break;
  }
  console.log(logFormatting, logString);
}