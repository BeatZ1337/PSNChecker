const Discord = require('discord.js')
const { exec } = require('child_process');

module.exports.run = (client, message, args) => {
    const devs = Object.values(client.config.developers).includes(message.author.id)
    if (!devs) {
        let nodevpermsEmbed = new Discord.MessageEmbed()
            .setAuthor(`-🚫 Permission Error`)
            .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
            .setDescription(`You don't have permission to use the \`dev\` commands as you aren't a developer of ${client.user.username}!`)
            .setColor(message.guild.member(client.user).displayHexColor)
            .setFooter(client.footer)
        message.channel.send(nodevpermsEmbed).catch(console.error);
    }
    if (devs)
    {
    var time = Date.now();
	var code = args.join(' ');
	if (!code) {
		return message.reply('You need to give me some code...');
	}
	message.reply(`Running command \`${code.replace('`', '\`')}\`... Please wait. _(The exec command **will** terminate the exec process if it takes longer that 30 seconds)_`); // eslint-disable-line no-useless-escape
	exec(`${code}`, { timeout: 1000000 }, (error, stdout) => {
		var response = (error || stdout); // eslint-disable-line no-extra-parens
		if (error) {
			if (error.message.length > 150) {
				message.channel.send(`${error.message}\n\n${Date.now() - time}ms`, { code: 'xl', split: true }).catch(console.error);
			} else {
				var evalEmbed = new Discord.MessageEmbed()
					.setAuthor(client.user.username, client.user.avatarURL || client.user.defaultAvatarURL)
					.setTitle('Exec ERROR')
					.setColor('RED')
					.setDescription(`\`\`\`xl\n${error.message}\`\`\``)
					.setFooter(`Time taken: ${Date.now() - time}ms`);
				console.error(error);
				return message.channel.send({ embed: evalEmbed }).catch(console.error);
			}
		}
		//console.log(response.message);
		var clean = response // Had to add this here as the client.clean function stringified it resulting in something like this: https://ndt3.got-lost-in.space/f6b575.png
			.replace(/`/g, '`' + String.fromCharCode(8203)) // eslint-disable-line prefer-template
			.replace(/@/g, '@' + String.fromCharCode(8203)) // eslint-disable-line prefer-template
			.replace(/\n/g, '\n' + String.fromCharCode(8203)) // eslint-disable-line prefer-template
			.replace(client.config.token, 'mfa.VkO_2G4Qv3T-- NO TOKEN HERE... --')
			// .replace(client.config.dashboard.oauthSecret, 'Nk-- NOPE --...')
			// .replace(client.config.dashboard.sessionSecret, 'B8-- NOPE --...')
			// .replace(client.config.cleverbotToken, 'CC-- NOPE --...')
			// .replace(client.config.googleAPIToken, 'AI-- NOPE --...');
		console.log(`${message.author.tag} (${message.author.id}) ran console command: \`${code}\``);
		if (clean.length > 1800) {
			message.channel.send(`${clean}\n\n${Date.now() - time}ms`, { code: 'xl', split: true }).catch(console.error);
		} else {
			evalEmbed = new Discord.MessageEmbed()
				.setAuthor(client.user.username, client.user.avatarURL || client.user.defaultAvatarURL)
				.setTitle('Exec Output')
				.setColor('GREEN')
				.setDescription(`\`\`\`xl\n${clean}\`\`\``)
				.setFooter(`Time taken: ${Date.now() - time}ms`);
			message.channel.send({ embed: evalEmbed }).catch(console.error);
		}
	});
    }
}

module.exports.help = {
    name: "exec",
    aliases: [],
    description: "Evaluate Code",
    usage: "exec <command name>",
    category: "Developer",
    cooldown: 2,
    enabled: true
};