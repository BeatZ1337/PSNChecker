const Discord = require('discord.js');
const moment = require("moment");
const os = require('os'); 
require("moment-duration-format")

module.exports.run = (client, message, args) => {
    let E = new Discord.MessageEmbed()
    message.channel.send(E.setTitle('Please Wait... <a:cerberusload:682431478671343646>')).then(m => {
        E.setTitle(`${client.user.username} - Uptime`)
        .setColor(message.guild.member(client.user).displayHexColor)
        .addField(`Bot Uptime:`, `\`${moment.duration(process.uptime()*1000).humanize()}\``, false)
        .addField(`Server Uptime:`, `\`${moment.duration(os.uptime()*1000).humanize()}\``, true)
        .setFooter(client.footer)
        m.edit(E).catch(console.error);
    })
}

module.exports.help = {
    name: "uptime",
    aliases: ["uptime", "upt", "botuptime"],
    description: "Bot Uptime",
    usage: "uptime",
    category: "General",
    cooldown: 2,
    enabled: true
};