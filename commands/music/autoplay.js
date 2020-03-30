const{ autoplay } = require("../../musicFunctions.js")

module.exports = {
    name : "autoplay",
    aliases : ["ap"],
    category: "music",
    description : "Toggle music autoplay",

    run : async(client, message, song) => {
    
      const serverQueue = message.client.queue.get(message.guild.id);
      let clientVoiceConnection = message.guild.voice.connection;
      
      if (!serverQueue)
      return message.channel.send("\`\`\`There is nothing playing.\`\`\`").catch(console.error);
  
      if (!clientVoiceConnection.voice.channel.members.has(message.member.id))
      return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
      
      if(!serverQueue.autoplay){
        autoplay(song,message).catch(console.error);
      };      

      // toggle from false to true and reverse
      serverQueue.autoplay = !serverQueue.autoplay;
      return serverQueue.textChannel
      .send(`\n \`\`\`Autoplay is now ${serverQueue.autoplay ? "ON" : "OFF"}\`\`\``)
      .catch(console.error);
    }
};