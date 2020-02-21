module.exports = {
    name : "remove",
    aliases : ["re"],
    category: "music",
    description : "Remove song from the queue",
    usage: "[ | ]",

    run : async(client, message, args) => {
        
        if (!args.length) return message.reply("\n \`\`\`Usage: /remove <Queue Number>\`\`\`");
    const serverQueue = message.client.queue.get(message.guild.id);
    if (!serverQueue) return message.channel.send("\n \`\`\`There is no queue.\`\`\`").catch(console.error);

    const song = serverQueue.songs.splice(args[0] - 1, 1);
    serverQueue.textChannel.send(`\n \`\`\`${message.author} ❌ removed ${song[0].title} from the queue.\`\`\``);
    }
};