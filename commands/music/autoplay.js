const{autoplay} = require("../../musicFunctions.js")

module.exports = {
    name : "autoplay",
    aliases : ["ap"],
    category: "music",
    description : "Toggle music autoplay",

    run : async(client, message, song) => {

    const serverQueue = message.client.queue.get(message.guild.id);

    if (!serverQueue) return message.reply("\n \`\`\`There is nothing playing.\`\`\`").catch(console.error);

    autoplay(song,message);

    // toggle from false to true and reverse
    serverQueue.autoplay = !serverQueue.autoplay;
    return serverQueue.textChannel
      .send(`\n \`\`\`Autoplay is now ${serverQueue.autoplay ? "ON" : "OFF"}\`\`\``)
      .catch(console.error);
    }
};