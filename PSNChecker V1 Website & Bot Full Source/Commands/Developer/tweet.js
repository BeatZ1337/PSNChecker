const Discord = require('discord.js');
const TwitterModule = require('twitter');

var Twitter = new TwitterModule({
    consumer_key: "",
    consumer_secret: "",
    access_token_key: "",
    access_token_secret: ""
});

module.exports.run = (client, message, args) => {    
    const devs = Object.values(client.config.developers).includes(message.author.id)
    if (!devs) {
        let nodevpermsEmbed = new Discord.MessageEmbed()
            .setAuthor(`🚫 Permission Error`)
            .setThumbnail(`https://i.imgur.com/uJtGhVW.png`)
            .setDescription("You don't have permission to use the `dev` commands as you aren't a developer of SlientBOT!")
            .setColor(message.guild.member(client.user).displayHexColor)
            .setFooter(client.footer);
        message.channel.send(nodevpermsEmbed).catch(console.error);
    }
    if (devs) {
        Twitter.post('statuses/update', {
            status: args.slice(0).join(' ')
        }, function(error, tweet) {
            if (error) return console.log(`[TWITTER MODULE]: Error: ${JSON.stringify(error)}`)
            if (tweet){ 
                const logs = client.channels.cache.find(c => c.id === "697368352695255080");
                 logs.send(`[ |||| ]\n ${client.user} has just tweeted out 😮\nhttps://twitter.com/PSNChecker/status/${tweet.id_str}`)
                 message.channel.send(`Check your twitter: https://twitter.com/PSNChecker/status/${tweet.id_str}`)
                }
             //if (response) return console.log(`[TWITTER MODULE]: Response: ${JSON.stringify(response)}`)
        });
    }
}

module.exports.help = {
    name: "tweet",
    aliases: ["twitter"],
    description: "Tweet to our twitter.",
    usage: "tweet",
    category: "Developer",
    cooldown: 2,
    enabled: true
};