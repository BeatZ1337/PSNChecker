const Discord = require("discord.js");
const chokidar = require("chokidar");
const { basename } = require("path");
const Logger = require("./console-monitor.js");
const fs = require("fs");

module.exports = (client, message) => {
    const event = fs.readdirSync("./Events");
    event.forEach(e => {
        chokidar.watch(`./Events/${e}`, { awaitWriteFinish: true }).on("change", (file) => {
            const mainevent = basename(file, ".js")
           // if (!file.endsWith(".js")) return;
            Logger(`Event ${mainevent}`, "eventupdating");
            const load = require(`../Events/${mainevent}`);
            let eventName = file.split(".")[0];
            client.on(eventName, load.bind(null, client));
            delete require.cache[require.resolve(`../Events/${mainevent}`)];
            Logger(`Event ${mainevent}`, "eventupdated");
        });
    });
};