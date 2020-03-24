module.exports = {
    name : "resume",
    category: "music",
    description : "Resume currently playing music",

    run : async(client, message) => {
      
      const serverQueue = message.client.queue.get(message.guild.id);
      
      if (!serverQueue)
      return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

      if (!serverQueue.channel.members.has(message.member.id))
      return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
    
      if (!serverQueue.playing) {
      serverQueue.playing = true;
      serverQueue.connection.dispatcher.resume();
      return serverQueue.textChannel.send(`\`\`\`${message.author} ▶ resumed the music!\`\`\``).catch(console.error);
    } else {
      return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);
    }
  }
};