const ytdl= require("discord-ytdl-core");
const { MessageEmbed } = require("discord.js");
const{ autoplay, checkChannelMembers } = require("../musicFunctions.js")

module.exports = {
  async play(song, message) {
    const queue = message.client.queue.get(message.guild.id);
    let clientVoiceConnection = message.guild.voice.connection;
    
    if (!song) {
      clientVoiceConnection.voice.channel.leave();
      queue.textChannel.send("\`\`\`Nothing is playing Disconnecting! \`\`\`");
      message.client.queue.delete(message.guild.id);
      return
    };
    
    try {
      var stream = await ytdl(song.url,{
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        encoderArgs: ['-af', 'equalizer=f=440:width_type=o:width=2:g=5']
    });
    } catch (error) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);        
      };

      if (error.message.includes("copyright")) {
        return message.channel
          .send("\n \`\`\`⛔ A video could not be played due to copyright protection ⛔\`\`\`")
          .catch(console.error);
      } else {
        console.error(error);
      };
    }

    const dispatcher = queue.connection
      .play(stream, {
        type: "opus",
        highWaterMark: 1,
        bitrate: 320000 
      })   
      .on("finish", () => {
        if ( checkChannelMembers(message) < 1){
          clientVoiceConnection.voice.channel.leave();
          queue.textChannel.client.queue.delete(message.guild.id);
          return queue.textChannel.send(`\`\`\`No one is in channel disconnecting!\`\`\``).catch(console.error);
        } else if (queue.loop) {  // if loop is on, push the song back at the end of the queue,so it can repeat endlessly
          let lastSong = queue.songs.shift();
          queue.songs.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else if(queue.autoplay && song ) {
          autoplay(song,message);
          module.exports.play(queue.songs[0], message); 
        } else { // Recursively play the next song
          queue.songs.shift();
          module.exports.play(queue.songs[0], message)
        }
      })
      .on("error", console.error);
    
      queue.connection.on("disconnect",() => {
        queue.textChannel.client.queue.delete(message.guild.id);
      })
      
      dispatcher.setVolumeLogarithmic(queue.volume / 100);
      
      try {
      const embed = new MessageEmbed()
      .setTitle(`🎶 Started playing: ${song.title}`)
      .setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`);
      
      var playingMessage = await queue.textChannel.send(embed);
      await playingMessage.react("⏭");
      await playingMessage.react("⏸");
      await playingMessage.react("▶");
      await playingMessage.react("⏹");
    } catch (error) {
      console.error(error);
    }
    
    const filter = (reaction, user) => user.id !== message.client.user.id;
    const collector = playingMessage.createReactionCollector(filter, { time: 1800000 });

    collector.on("collect", (reaction, user) => {
      
      if (!queue) return; // Stop if there is no queue on the server
      
      switch (reaction.emoji.name) {
        case "⏭":
          if(!queue.channel.members.has(user.id)) break;
          queue.connection.dispatcher.end();
          queue.textChannel.send(`\`\`\`${user.username} ⏩ skipped the song\`\`\``).catch(console.error);
          collector.stop();
          playingMessage.reactions.removeAll();
          break;

        case "⏸":
          if(!queue.channel.members.has(user.id)) break;
          if(!queue.playing) break;
          queue.playing = false;
          queue.connection.dispatcher.pause();
          queue.textChannel.send(`\`\`\`${user.username} ⏸ paused the music.\`\`\``).catch(console.error);
          break;

        case "▶":
          if(!queue.channel.members.has(user.id)) break;
          if(queue.playing) break;
          queue.playing = true;
          queue.connection.dispatcher.resume();
          queue.textChannel.send(`\`\`\`${user.username} ▶ resumed the music!\`\`\``).catch(console.error);
          break;

        case "⏹":  
          if(!queue.channel.members.has(user.id)) break;
          queue.songs = [];
          queue.connection.dispatcher.end();
          queue.textChannel.send(`\`\`\`${user.username} ⏹ stopped the music!\`\`\``).catch(console.error);
          collector.stop();
          playingMessage.reactions.removeAll();
          break;

        default:
          break;
      }
    });

    collector.on("end", () => {
      playingMessage.reactions.removeAll();
    });
  }
};
