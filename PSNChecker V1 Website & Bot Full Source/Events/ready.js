const os = require('os'); // Used to get OS 
const fs = require("fs");
const Logger = require("../Monitors/console-monitor.js");
module.exports = async (client) => {
   require("../Website/server")(client); 
    const categories = fs.readdirSync("./Commands");
    client.packages = require("../package.json"); // Required to get Bot's Current Version. (DO NOT REMOVE)
    //let timeDate = `${client.readyAt.getDate()}/${client.readyAt.getMonth()+1}/${client.readyAt.getFullYear()} | ${client.readyAt.getHours().toString().length < 2 ? "0" + client.readyAt.getHours() : client.readyAt.getHours().toString()}:${client.readyAt.getMinutes().toString().length < 2 ? "0" + client.readyAt.getMinutes() : client.readyAt.getMinutes().toString()}${client.readyAt.getHours() > 12 ? "pm" : "am"}`
    //Object.values(ascii).forEach(line => console.log(line));
    client.userAgent = `Discordbot/2.0; ${client.user.username}/${client.packages.version}; Developed By Thunder & Cerberus.`;
    console.warn(`${client.user.username} v${client.packages.version}\nProcess ID: ${process.pid} \nPlatform: ${os.type()} v${os.release()} ${os.arch()} ${os.platform()}`);
    const amount = await client.shard.broadcastEval('this.guilds.cache.size');
    const amount2 = await amount.reduce((prev, val) => prev + val, 0);
    const amount3 = await client.shard.broadcastEval('this.users.cache.size');
    const amount4 = await amount3.reduce((prev, val) => prev + val, 0);
    if (client.config.disabled === true) {  
        const developmentpresences = [
            `in Development`
          ];    
          setInterval(() => {
            const ry = Math.floor(Math.random() * developmentpresences.length);
            client.user.setActivity(developmentpresences[ry], {
              name: developmentpresences[ry],
              type: "WATCHING"
            });
          }, 18000);
        console.log("Maintenance Mode Enabled");
      } else {
        const presences = [
          `${client.config.prefix} help`,
          `${amount2} Guilds`,
          `${amount3} Users`,
        ];    
        setInterval(() => {
          const ry = Math.floor(Math.random() * presences.length);
          client.user.setActivity(presences[ry], {
            name: presences[ry],
            type: "WATCHING"
          });
        }, 18000);
    }
    categories.forEach(category => {
        const files = fs.readdirSync(`./Commands/${category}`);
        if (category === "General")
            Logger(
                `\n${client.user.tag} has loaded with: Total of ${files.length} General Commands`
            );
        else if (category === "Developer") {
            Logger(
                `\n${client.user.tag} has loaded with: Total of ${files.length} Developer Commands`
            );
        }
        files.forEach(command => {
            if (command.split(".").slice(-1)[0] !== 'js') return;
            const props = require(`../Commands/${category}/${command}`);
            client.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                client.aliases.set(alias, props.help.name);
                console.log(`Loaded ${command} from ${category} with aliases ${alias}`)
            });
        })
    });
    console.log(`${client.user.username} is online and ready.`)
}