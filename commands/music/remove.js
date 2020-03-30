module.exports = {
    name : "remove",
    aliases : ["re"],
    category: "music",
    description : "Remove song from the queue",
    usage: "[ | ]",

    run : async(client, message, args) => {
    
        const serverQueue = message.client.queue.get(message.guild.id);
        let clientVoiceConnection = message.guild.voice.connection
        
        if (!serverQueue)
        return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);
    
        if (!clientVoiceConnection.voice.channel.members.has(message.member.id))
        return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
        
        if (!args.length) return message.channel.send("\n \`\`\`Usage: /remove <Queue Number>\`\`\`");
    
        const song = serverQueue.songs.splice(args[0] - 1, 1);
        serverQueue.textChannel.send(`\`\`\`${message.author} ❌ removed ${song[0].title} from the queue.\`\`\``).catch(console.error);
    }
};