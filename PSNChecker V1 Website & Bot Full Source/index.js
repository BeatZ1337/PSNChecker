String.prototype.titleCase = function() {
	const splitStr = this.toLowerCase().split(' ');
	for (let i = 0; i < splitStr.length; i++) {
		splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
	}
	return splitStr.join(' ');
};

const Discord = require('discord.js');
const client = new Discord.Client();
client.config = require("./Settings/config.json");

let d19 = new Date();
client.footer = `2019 - ${d19.getFullYear()} PSNChecker | Developed By APIDepartment`;
client.footerIMG = client.config.footerIMG;

client.abused = new Set();
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldowns = new Discord.Collection();

client.available = 0;
client.taken = 0;
client.checked = 0;



require("./Monitors/console-monitor.js");(client);
require("./Monitors/command-reloader.js")(client);
require("./Monitors/event-reloader.js")(client);
const Logger = require("./Monitors/console-monitor.js");

client.on("ready", () => require("./Events/ready.js")(client));
client.on("message", message => require(`./Events/message.js`)(client, message));

// Console Information
client.on("error", error => {
    Logger("[UNHANDLED REJECTION] " + (error.stack == undefined ? error : error.stack), "warn");
});
client.on("warn", warn => {
    Logger("[WARNING] " + warn, "warn");
});
client.on("debug", debug => {
    Logger(debug, "debug");
});

//Console Logger
process.on('unhandledRejection', (error) => {
    Logger("[UNHANDLED REJECTION] " + (error.stack == undefined ? error : error.stack), "warn");
});

process.on('uncaughtException', (err) => {
    Logger("[UNCAUGHT EXCEPTION] " + (err.stack == undefined ? err : err.stack), "critical");
});
let d = new Date();
client.once("reconnecting", (err) => {
    Logger(`Reconnecting @ ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours().toString().length < 2 ? "0" + d.getHours() : d.getHours().toString()}:${d.getMinutes().toString().length < 2 ? "0" + d.getMinutes() : d.getMinutes().toString()}${d.getHours() > 12 ? "PM" : "AM"}`, "warn");
});
let d2 = new Date();
client.once("connect", (err) => {
    Logger(`Reconnecting @ ${d.getDate()}/${d2.getMonth()+1}/${d2.getFullYear()} ${d2.getHours().toString().length < 2 ? "0" + d.getHours() : d2.getHours().toString()}:${d2.getMinutes().toString().length < 2 ? "0" + d2.getMinutes() : d2.getMinutes().toString()}${d2.getHours() > 12 ? "PM" : "AM"}`, "warn");
});

client.once("disconnect", (err) => {
    Logger(`Disconnected From Discord @ ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours().toString().length < 2 ? "0" + d.getHours() : d.getHours().toString()}:${d.getMinutes().toString().length < 2 ? "0" + d.getMinutes() : d.getMinutes().toString()}${d.getHours() > 12 ? "PM" : "AM"}`, "critical");
});

client.login(client.config.token);