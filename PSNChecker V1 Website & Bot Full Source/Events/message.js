const Discord = require('discord.js');

module.exports = async (client, message) => {
  if (message.author.bot || message.channel.type === "dm") return;
  if (message.channel.type === "dm") return;  
  if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
    return message.reply(`My Prefix Is \`${client.config.prefix}\``);
  }
  if (!message.content.startsWith(client.config.prefix)) return;
  const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  let command;
  if (client.commands.has(cmd)) {
    command = client.commands.get(cmd);    
  } else if (client.aliases.has(cmd)) {
    command = client.commands.get(client.aliases.get(cmd));    
  }
  if (client.config.commandNotFound == true) {
    if (!command) return;
  }
  if (!client.cooldowns.has(command.help.name)) {
    client.cooldowns.set(command.help.name, new Discord.Collection());
  }
  if (command.help.enabled === false) {
    message.delete();
    let cmdenabledembed = new Discord.MessageEmbed()
      .setTitle(`Error`)
      .setDescription(`❌ ${message.author}, This command is disabled.`)
      .setColor(message.guild.member(client.user).displayHexColor)
      .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
      .setFooter(client.footer)
    return message.channel.send(cmdenabledembed).then(message => message.delete(200 * 200)).catch(console.error);
  }
  if (command.help.testing === true && message.author.id != "664242899105480715") {
    message.delete();
    let cmdtestingembed = new Discord.MessageEmbed()
      .setTitle(`Error`)
      .setDescription(`❌ ${message.author}, This command is in beta testing stages.`)
      .setColor(message.guild.member(client.user).displayHexColor)
      .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
      .setFooter(client.footer)
   return message.channel.send(cmdtestingembed).then(message => message.delete(200 * 200)).catch(console.error);
  }
  const now = Date.now();
  const timestamps = client.cooldowns.get(command.help.name);
  const cooldownAmount = (command.help.cooldown || 3) * 1000;  
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {}
      let cmdcooldownerror = new Discord.MessageEmbed()
        .setTitle(`Error`)
        .setColor(message.guild.member(client.user).displayHexColor)
        .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
        .setDescription(`Please wait ${timeLeft.toFixed(0)} more second(s) before reusing the \`${command.help.name}\` command.`)
        .setFooter(client.footer)
      return message.channel.send(cmdcooldownerror).then(message => message.delete(200 * 200));
    }
  }
  try {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    command.run(client, message, args);
    if (message.guild.me.hasPermission("MANAGE_MESSAGES")) {
      message.delete();
    }
  } catch (err) {
    if (err) return console.log(err);
  }
}