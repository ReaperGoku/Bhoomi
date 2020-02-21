module.exports = {
    name : "volume",
    aliases : ["vol"],
    category: "music",
    description : "Change volume of currentply playing voiceConnection",
    usage: "[ Volume 0-100 ]",

    run : async(client, message, args) => {
        const serverQueue = message.client.queue.get(message.guild.id);

    if (!message.member.voiceChannel)
      return message.reply("\n \`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);
    if (!serverQueue) return message.reply("\n \`\`\`There is nothing playing.\`\`\`").catch(console.error);

    if (!args[0])
      return message.reply(`\n \`\`\`🔊 The current volume is: **${serverQueue.volume}%**\`\`\``).catch(console.error);
    if (isNaN(args[0])) return message.reply("\n \`\`\`Please use a number to set volume.\`\`\`").catch(console.error);
    if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("\n \`\`\`Please use a number between 0 - 100.\`\`\`").catch(console.error);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

    return serverQueue.textChannel.send(`\n \`\`\`Volume set to: ${args[0]}%\`\`\``).catch(console.error);
    }
};