const {
	MessageEmbed
} = require("discord.js");
const {
	readdirSync
} = require("fs");

module.exports.run = (client, message, args) => {
	const embed = new MessageEmbed()
		.setColor(message.guild.member(client.user).displayHexColor)
		.setAuthor(`${client.user.username} Help Command`, client.user.displayAvatarURL)
		.setFooter(client.footer)
	if (args[0]) {
		let command = args[0];
		let cmd;
		if (client.commands.has(command)) {
			cmd = client.commands.get(command);
		} else if (client.aliases.has(command)) {
			cmd = client.commands.get(client.aliases.get(command));
		}
		if (!cmd) return message.channel.send(embed.setTitle("Invalid Command.").setDescription(`Do \`${client.config.prefix}help\` for the list of the commands.`));
		command = cmd.help;
		embed.setTitle(`${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} - Help Command`);
		embed.setDescription([
			"`<>`means needed, `()` it is optional and `**` is a warning but *don't include these prefixes*",
			`> **Command:** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}`,
			`> **Description:** ${command.description || "No Description Provided."}`,
			`> **Usage:** ${command.usage ? `\`${client.config.prefix}${command.name} ${command.usage}\`` : "No Usage Provided"} `,
			`> **Aliases:** ${command.aliases ? command.aliases.join(", ") : "None"}`,
			`> **Category:** ${command.category ? command.category : "General" || "Misc"}`,
			`> **Cooldown:** ${command.cooldown?`${command.cooldown} second(s)`:"No Cooldown"}`,
			`> **Enabled:** ${command.enabled === true ? "Yes" : "No"}`
		].join("\n"));
		return message.channel.send(embed);
	}
	const categories = readdirSync("./Commands/");
	embed.setDescription([
		`Available commands for ${client.user.username}.`,
		`My default-prefix is \`${client.config.prefix}\``,
		`You can find information about a command by doing \`${client.config.prefix} help (command name)\``,
	].join("\n"));
	categories.forEach(category => {
		const dir = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase());
		const s = client.commands.filter(c => c.help.category.toLowerCase() === category.toLowerCase()).size;
		const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
		const devs = Object.values(client.config.developers).includes(message.author.id)
		try {
			if (dir.size === 0) return;
			if (devs) embed.addField(`> ${capitalise} (${s}) `, dir.map(c => `\`${c.help.name}\``).join(" | "));
			else if (category !== "Developer") embed.addField(`> ${capitalise} (${s}) `, dir.map(c => `\`${c.help.name}\``).join(" | "));
		} catch (e) {
			console.log(e);
		}
	});
	return message.channel.send(embed);
}



module.exports.help = {
	name: "help",
	aliases: ["h", "helpme", "cmdinfo"],
	description: "Help command to show the commands",
	usage: "(command name)",
	category: "General",
	cooldown: 2,
	enabled: true
};