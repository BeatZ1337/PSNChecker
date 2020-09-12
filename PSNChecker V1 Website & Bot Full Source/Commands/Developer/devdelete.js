

module.exports.run = (client, message, args) => {

    if (message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.messages.cache.get(args.join(" ")).delete()
    message.react('👍')
    }else{
    message.channel.messages.cache.get(args.join(" ")).delete()
    message.react('👍')
    }
}


module.exports.help = {
    name: "devdel",
	aliases: ["devdel","msgdel"],
	description: "Master Override",
	usage: "<command name>",
    category: "Developer",
    cooldown: 1
};