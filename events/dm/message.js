const Discord = require('discord.js');

module.exports = async (client, message) => {

    const config = {
        prefix : process.env.PREFIX,
        SERVER_ID: "424819916185665546",
        CHANNEL_ID: "679026068165754934"        
    };

    if (message.channel.type === "dm") { 
        var args = message.content.split(" ").slice(0)
        var args = args.slice(0).join(" ")
        var BOT_ID = client.user.id
        var userID = message.author.id
        if (message.content.startsWith(config.prefix)) return message.channel.send("❌ Please use commands in real server! ❌") 
        if (message.author.bot) return;
        message.channel.send("This message has been send to the staff! 💌").then(msg => msg.delete(3000))
        if (message.content.startsWith(config.PREFIX)) return
        if (args.length > 1024) return message.reply("Your message content too many characters (1024 Limit) :/") 
        var embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setAuthor("New Message", "https://cdn.discordapp.com/attachments/502649544622735362/520740243133956138/receive.png")
            .setDescription(`\`\`\`${args}\`\`\``)
            .setTitle("Message:")
            .setFooter("This Message Was Sent By: " + message.author.username + " ", message.author.avatarURL)
            .setTimestamp()
        client.guilds.get(config.SERVER_ID).channels.get(config.CHANNEL_ID).send(embed).catch(console.log(`Message recieved from ${userID}!(${message.author.username})`))
        client.guilds.get(config.SERVER_ID).channels.get(config.CHANNEL_ID).send(`\`\`\`${config.prefix}reply ${message.author.id} <message>\`\`\``)
    }else
    
    if (message.content.startsWith(config.prefix + "reply")) {
        if (!message.member.roles.has('475657644678578186')) return message.reply('You cannot use that!')
        var args = message.content.split(" ").slice(0)
        var Rargs = message.content.split(" ").slice(2).join(" ")
        var userID = args[1]
        if (isNaN(args[1])) return message.reply("This is not an ID! Make sure to you the user's ID!")
        var embed = new Discord.RichEmbed()
            .setColor(config.ORANGE)
            .setAuthor("New Message", "https://cdn.discordapp.com/attachments/502649544622735362/520740243133956138/receive.png")
            .setDescription(Rargs)
            .setTitle("**Message**:")
            .setFooter("This Message Was Sent By: " + client.user.username + " ", client.user.avatarURL)
        client.users.get(userID).send(embed).catch(console.log(`Message was sent to ${userID}!`))
        if (message.author.bot) return;
        message.channel.send("Your Message was Sent!").then(msg => msg.delete(3000)).catch(console.error)

    }

};