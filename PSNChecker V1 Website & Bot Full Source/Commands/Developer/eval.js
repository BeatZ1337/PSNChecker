const Discord = require('discord.js')
const hastebin = require('hastebin-gen');
require("moment-duration-format");

module.exports.run = (client, message, args) => {
    const devs = Object.values(client.config.developers).includes(message.author.id)
    let start = Date.now();
    if (!devs) {
        let nodevpermsEmbed = new Discord.MessageEmbed()
            .setAuthor(`🚫 Permission Error`)
            .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
            .setDescription(`You don't have permission to use the \`eval\` commands as you aren't a developer of ${client.user.username}!`)
            .setColor(message.guild.member(client.user).displayHexColor)
            .setFooter(client.footer)
        message.channel.send(nodevpermsEmbed).catch(console.error);
    }
    if (devs) {
        const beautify = (text) => {
            if (typeof (text) === 'string') {
                return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
            } else {
                return text
            }
        }
        try {
            const code = args.join(' ')
            let evaled = eval(code)

            if (typeof evaled !== 'string') {
                evaled = require('util').inspect(evaled, {
                    depth: 0
                })
            }
            if (evaled.includes(client.token || config.token)) {
                evaled = evaled.replace(client.token, 'REDACTED!')
            }
            if (beautify(evaled).length > 1800) {
                hastebin(`[${args.join(" ")}]: \n${evaled}`, "eval").then(r => {
                    var hastLink = r
                    console.log(`[Eval output exceeds 2000 characters | ${args.join(" ")}]: ${hastLink}`);
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Eval output exceeds 2000 characters | ${args.join(" ")}`)
                        .setURL(`${hastLink}`)
                        .setColor(Math.floor(Math.random() * (0xFFFFFF + 1)))
                        .setDescription(`Eval output exceeds 2000 characters. \nView Evaluation [here](${hastLink}).`)
                        .setFooter(`Eval Output`)
                        .setTimestamp()
                    message.channel.send({
                        embed
                    }).catch((e) => message.channel.send(e.message))
                }).catch(console.error);
            } else {
                let diff = (Date.now() - start).toFixed(0);
                const embed2 = new Discord.MessageEmbed()
                    .setTitle(`${client.user.username} Development Evaluation | SUCCESS`)
                    .addField(`Eval Input 📥`, `\`\`\`fix\n${beautify(args.join(" "))}\`\`\``)
                    .addField(`Eval Output 📤`, `\`\`\`fix\n${beautify(evaled)}\`\`\``)
                    .addField(`Type`, `\`\`\`\n${typeof(evaled)}\`\`\``)
                    .addField(`Time Taken`, `\`\`\`\n${diff}ms\`\`\``)
                message.channel.send(embed2)
            }
        } catch (err) {
            console.log(err)
            err = err.toString()
            if (err.includes(client.token || config.token)) {
                err = err.replace(client.token, 'REDACTED!')
            }
            let diff = (Date.now() - start).toFixed(0);
            const embed2 = new Discord.MessageEmbed()
                .setTitle(`${client.user.username} Development Evaluation | ERROR`)
                .addField(`Eval Input 📥`, `\`\`\`fix\n${beautify(args.join(" "))}\`\`\``)
                .addField(`Eval Output 📤`, `\`\`\`fix\n${beautify(err)}\`\`\``)
                .addField(`Type`, `\`\`\`\n${typeof(err)}\`\`\``)
                .addField(`Time Taken`, `\`\`\`\n${diff}ms\`\`\``)
            message.channel.send(embed2)
        }
    }
}

module.exports.help = {
    name: "eval",
    aliases: ["eval", "e", "edev"],
    description: "Evaluate Code",
    usage: "eval <command name>",
    category: "Developer",
    cooldown: 2,
    enabled: true
};