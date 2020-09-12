const Discord = require('discord.js')
const hastebin = require('hastebin-gen');
require("moment-duration-format");
const config = require("../../Settings/config.json");

module.exports.run = (client, message, args) => {
    const devs = Object.values(client.config.developers).includes(message.author.id)
    if (!devs) {
        let nodevpermsEmbed = new Discord.MessageEmbed()
            .setAuthor(`🚫 Permission Error`)
            .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
            .setDescription(`You don't have permission to use the \`guilds
            \` commands as you aren't a developer of ${client.user.username}!`)
            .setColor(message.guild.member(client.user).displayHexColor)
            .setFooter(client.footer)
        message.channel.send(nodevpermsEmbed).catch(console.error);
    }
    if (devs) {
        let guilds = client.guilds.cache.map(g => `${g.name.replace(/[^\x00-\x7F]/g, "")}${" ".repeat(Math.floor(Math.max(...client.guilds.cache.map(g => g.name.length)))+ - g.name.replace(/[^\x00-\x7F]/g, "").length)} | ${g.memberCount}`).join('\n')
        const embed = new Discord.MessageEmbed()
        .setColor(message.guild.member(client.user).displayHexColor)
        .setAuthor(` Guild Name | Guild Member Count `)
        .setDescription(`\`\`\`js\n${guilds}\`\`\``)
        .addField('[**__Guild Count__**]', `\`\`\`js\n${client.guilds.cache.size}\`\`\``, true)
        .addField('[**__User Count__**]', `\`\`\`js\n${client.users.cache.size}\`\`\``, true)
        .setFooter(client.footer)
        return message.channel.send(embed);
    }
}

module.exports.help = {
    name: "guilds",
    aliases: ["guildc"],
    description: "Guild Count",
    usage: "<command name>",
    category: "Developer",
    cooldown: 2,
    enabled: true
};