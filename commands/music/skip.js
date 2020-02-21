module.exports = {
    name : "skip",
    aliases : ["s"],
    category: "music",
    description : "Skip the currently playing song",

    run : async(client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voiceChannel)
      return message.reply("\n \`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);
    if (!serverQueue)
      return message.channel.send("\n \`\`\`There is nothing playing that I could skip for you.\`\`\`").catch(console.error);

    serverQueue.connection.dispatcher.end();
    
    serverQueue.textChannel.send(`\n \`\`\`${message.author} ⏭ skipped the song\`\`\``).catch(console.error);
    }
};