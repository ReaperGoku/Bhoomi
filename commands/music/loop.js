module.exports = {
    name : "loop",
    category: "music",
    description : "Toggle music loop",

    run : async(client, message) => {

      const serverQueue = message.client.queue.get(message.guild.id);
      
      if (!serverQueue)
      return message.reply("\`\`\`There is nothing playing.\`\`\`").catch(console.error);

      if (!serverQueue.channel.members.has(message.member.id))
      return message.reply(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
      
      // toggle from false to true and reverse
      serverQueue.loop = !serverQueue.loop;
      return serverQueue.textChannel
      .send(`\n \`\`\`Loop is now ${serverQueue.loop ? "ON" : "OFF"}\`\`\``)
      .catch(console.error);
      }    
};