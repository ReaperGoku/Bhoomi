module.exports = {
    name : "pause",
    category: "music",
    description : "Pause the currently playing music",

    run : async(client, message, args) => {
        if (!message.member.voiceChannel)
      return message.reply("\n \`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);

    const serverQueue = message.client.queue.get(message.guild.id);
    if (serverQueue && serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return serverQueue.textChannel.send(`\n \`\`\`${message.author} ⏸ paused the music.\`\`\``).catch(console.error);
    }
    return message.reply("\n \`\`\`There is nothing playing.\`\`\`").catch(console.error);
    }
};