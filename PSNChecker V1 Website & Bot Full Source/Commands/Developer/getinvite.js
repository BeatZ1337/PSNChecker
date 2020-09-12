const Discord = require('discord.js')
const config = require("../../Settings/config.json");

module.exports.run = async (client, message, args) => {
    const devs = Object.values(config.developers).includes(message.author.id)
    if (!devs) {
        let nodevpermsEmbed = new Discord.MessageEmbed()
            .setAuthor(`🚫 Permission Error`)
            .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
            .setDescription("You don't have permission to use the `dev` commands as you aren't a developer of BoogieBOT!")
            .setColor(message.guild.member(client.user).displayHexColor)
            .setFooter(client.footer);
        message.channel.send(nodevpermsEmbed).catch(console.error);
    }
    if (devs) {
      const guildID = client.guilds.cache.get(args[0]); 
      //if (!guildID || guildID > 16) return message.channel.send(`​Please provide a Guild ID...\nA Guild ID is 16 digits long.`)
      //if (!guildID || guildID < 16) return message.channel.send(`​Please provide a Guild ID...\nA Guild ID is 16 digits long.`​);
      let code = await guildID.fetchInvites().then(invites =>invites.first().url).catch(console.error);
      message.channel.send('Found Invite:\n' + code)
    }
}

module.exports.help = {
    name: "getinvite",
    aliases: ["ginvite"],
    description: "Gets a Invite of a guild the bot is in.",
    usage: "getinvite <command name>",
    category: "Developer",
    cooldown: 2,
    enabled: true
};