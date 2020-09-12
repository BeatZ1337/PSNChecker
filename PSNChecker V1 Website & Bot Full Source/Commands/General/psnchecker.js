const Discord = require('discord.js')
const request = require('request')
module.exports.run = async (client, message, args) => {
    if(!args[0]) return message.channel.send(`Please provide a PSN to check, \`psncheck <psn_name>\``).then(m=>m.delete({timeout:1000}));// message here
    let headers = {'Content-Type': 'application/json'}
    let PSNName = args[0]
    if(PSNName.length > 16) return message.channel.send(`Please lower the characters of the chosen PSN to a maximum of 16 Characters.`).then(m=>m.delete({timeout:1000}));
    request.post('https://accounts.api.playstation.com/api/v1/accounts/onlineIds', {
      json: {
        "onlineId": args[0],
        "reserveIfAvailable": false
      },
      headers: headers
    }, (error, res, body) => {
      if (error) {
        console.error(error)
        message.channel.send(`Technical Error Retrieving Resolver Information\n[ERROR]: ${error}`).then(m=>m.delete({timeout:1000}))
        return
      }
      let psn = new Discord.MessageEmbed()
    message.channel.send(psn.setTitle('Please Wait, Grabbing Information... <a:cerberus:690592811141169203>')).then(m => {
        if(res.statusCode !== 401 && res.statusCode !== 400) {
                    psn.setTimestamp()
                    psn.setTitle(`PSN Checker`)
                    psn.setDescription(`Checking PSN: ${args}\n\n**__PSN Information__**\n`)
                    psn.addField("Result:", `${args[0]} is Available.`, true)
                    psn.setFooter(footer)
                    psn.setColor(message.guild.member(client.user).displayHexColor)
                    psn.setThumbnail(client.config.botLogo);
                } else {
                    psn.setTimestamp()
                    psn.setTitle(`PSN Checker`)
                    psn.setDescription(`Checking PSN: ${args}\n\n**__PSN Information__**\n`)
                    psn.addField("Result:", `${args[0]} is Taken.`, true)
                    psn.setFooter(client.footer)
                    psn.setColor(message.guild.member(client.user).displayHexColor)
                    psn.setThumbnail(client.config.botLogo);
                }
                m.edit(psn);
            }).catch(err => message.channel.send(`Technical Error Retrieving Resolver Information\n[ERROR]: ${err}`));
        })
}


module.exports.help = {
    name: "psnchecker",
    aliases: [
        "psncheck","checkpsn", "findpsn"
    ],
    description: "See if PSN is available.",
    usage: "<gamertag>",
    category: "General",
    cooldown: 5,
    enabled: true,
    testing: false
};