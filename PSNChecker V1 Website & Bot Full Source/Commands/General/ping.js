const Discord = require("discord.js");

module.exports.run = (client, message) => {
    let embed = new Discord.MessageEmbed()
    message.channel.send(embed.setTitle('Please Wait... <a:cerberusload:682431478671343646>')).then(m => {
        embed.setColor(message.guild.member(client.user).displayHexColor)
            .setTitle(`${client.user.username}'s Ping`)
            .addField(`Websocket:`, `\`${client.ws.ping}ms\``)
            .addField(`Latency:`, `\`${m.createdTimestamp - message.createdTimestamp}ms\``)           
            .setFooter(client.footer);
        m.edit(embed);
    })
}

module.exports.help = {
    name: "ping",
    aliases: ["pinginfo", "bping", "bpi", "botping"],
    description: "Find out information about the Ping",
    usage: "(command name)",
    category: "General",
    cooldown: 5,
    enabled: true
};