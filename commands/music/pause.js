module.exports = {
  name : "pause",
  category: "music",
  description : "Pause the currently playing music",

  run : async(client, message) => {
    
    const serverQueue = message.client.queue.get(message.guild.id);
    let clientVoiceConnection = message.guild.voice.connection
    
    if (!serverQueue)
    return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

    if (!clientVoiceConnection.voice.channel.members.has(message.member.id))
    return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
  
    if (serverQueue.playing) {
      serverQueue.playing = false;
      serverQueue.connection.dispatcher.pause();
      return serverQueue.textChannel.send(`\`\`\`${message.author} ⏸ paused the music.\`\`\``).catch(console.error);
    } else {
      return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);
    }
    }
  };