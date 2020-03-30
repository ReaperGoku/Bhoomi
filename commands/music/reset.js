const { MessageEmbed } = require("discord.js");
const { getMember } = require("../../functions.js");

module.exports = {
    name : "reset",
    category: "music",
    description : "Reset Music Bot",
    

    run : async(client, message, args) => {

        if(!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send("You don't have premission to do that!");

        const serverQueue = message.client.queue.get(message.guild.id);
        
        if (!serverQueue)
        return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);
        
        message.client.queue.delete(message.guild.id);
        message.channel.send("\> Reset Done!")
    }
};

