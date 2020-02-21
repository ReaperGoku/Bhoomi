module.exports = {
    name : "autoplay",
    category: "music",
    description : "Toggle music autoplay",

    run : async(client,message) => {

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) return message.reply("\n \`\`\`There is nothing playing.\`\`\`").catch(console.error);

    // toggle from false to true and reverse
    serverQueue.autoplay = !serverQueue.autoplay;
    return serverQueue.textChannel
      .send(`\n \`\`\`Autoplay is now ${serverQueue.autoplay ? "ON" : "OFF"}\`\`\``)
      .catch(console.error);
    }
};