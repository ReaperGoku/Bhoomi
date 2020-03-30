module.exports = {
  name : "stop",
  aliases : ["dc","leave"],
  category: "music",
  description : "Stops the music",

  run : async(client, message) => {
    
    const serverQueue = message.client.queue.get(message.guild.id);
    let clientVoiceConnection = message.guild.voice.connection
    
    if (!serverQueue)
    return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

    if (!clientVoiceConnection.voice.channel.members.has(message.member.id))
    return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
    
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
    serverQueue.textChannel.send(`\`\`\`${message.member.displayName} ⏹ stopped the music!\`\`\``).catch(console.error);
  }
};