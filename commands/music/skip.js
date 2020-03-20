module.exports = {
    name : "skip",
    aliases : ["s"],
    category: "music",
    description : "Skip the currently playing song",

    run : async(client, message) => {
      
      const serverQueue = message.client.queue.get(message.guild.id);
      
      if (!serverQueue)
      return message.reply("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

      if (!serverQueue.channel.members.has(message.member.id))
      return message.reply(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
    
      serverQueue.connection.dispatcher.end();
    
      serverQueue.textChannel.send(`\`\`\`${message.member.displayName} ⏭ skipped the song\`\`\``).catch(console.error);
    }
};