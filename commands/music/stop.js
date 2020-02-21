module.exports = {
    name : "stop",
    category: "music",
    description : "Stops the music",

    run : async(client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

        if (!message.member.voiceChannel)
          return message.reply("\n \`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);
        if (!serverQueue) return message.reply("\n \`\`\`There is nothing playing.\`\`\`").catch(console.error);
    
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end();
        serverQueue.textChannel.send(`\n \`\`\`${message.author} ⏹ stopped the music!\`\`\``).catch(console.error);
    }
};