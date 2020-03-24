module.exports = {
    name : "volume",
    aliases : ["vol"],
    category: "music",
    description : "Change volume of currentply playing voiceConnection",
    usage: "[ Volume 0-100 ]",

    run : async(client, message, args) => {
      
      const serverQueue = message.client.queue.get(message.guild.id);
      
      if (!serverQueue)
      return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

      if (!serverQueue.channel.members.has(message.member.id))
      return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
    
      if (!args[0])
      return message.channel.send(`\`\`\`🔊 The current volume is: **${serverQueue.volume}%**\`\`\``).catch(console.error);
      if (isNaN(args[0])) return message.channel.send("\n \`\`\`Please use a number to set volume.\`\`\`").catch(console.error);
      if (parseInt(args[0]) > 100 || parseInt(args[0]) < 0)
      return message.reply("\`\`\`Please use a number between 0 - 100.\`\`\`").catch(console.error);
    
      serverQueue.volume = args[0];
      serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    
      return serverQueue.textChannel.send(`\`\`\`Volume set to: ${args[0]}%\`\`\``).catch(console.error);
    }
};