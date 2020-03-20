module.exports = {
    name : "stop",
    aliases : ["dc","leave"],
    category: "music",
    description : "Stops the music",

    run : async(client, message) => {
      const serverQueue = message.client.queue.get(message.guild.id);
      
      if (!serverQueue)
      return message.reply("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

      if (!serverQueue.channel.members.has(message.member.id))
      return message.reply(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
      
      serverQueue.songs = [];
      serverQueue.connection.dispatcher.end();
      serverQueue.textChannel.send(`\`\`\`${message.member.displayName} ⏹ stopped the music!\`\`\``).catch(console.error);
    }
};