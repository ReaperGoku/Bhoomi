const { Util, RichEmbed } = require("discord.js");
const { play } = require("../../include/play");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

module.exports = {
    name : "play",
    aliases : ["p"],
    category: "music",
    description : "Plays audio from YouTube",
    usage: "[ Song name | Song url ]",

    run : async(client, message, args) => {
        const config = {
            YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY
        };

        const youtube = new YouTubeAPI(config.YOUTUBE_API_KEY);

        const channel = message.member.voiceChannel;

        if (!args.length) return message.reply("\n \`\`\`Usage: /play <YouTube URL | Video Name>\`\`\`").catch(console.error);
        if (!channel) return message.reply("\n \`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);
    
        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
          return message.reply("\n \`\`\`Cannot connect to voice channel, missing permissions\`\`\`");
        if (!permissions.has("SPEAK"))
          return message.reply("\n \`\`\`I cannot speak in this voice channel, make sure I have the proper permissions!\`\`\`");
    
        const search = args.join(" ");
        const videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|yo  utu\.?be)\/.+$/gi;
        const playlistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        const url = args[0];
        const urlValid = videoPattern.test(args[0]);
    
        // Start the playlist if playlist url was provided
        if (!videoPattern.test(args[0]) && playlistPattern.test(args[0])) {
          return message.client.commands.get("playlist").execute(message, args);
        }
    
        const serverQueue = message.client.queue.get(message.guild.id);
        const queueConstruct = {
          textChannel: message.channel,
          channel : channel,
          connection: null,
          songs: [],
          loop: false,
          volume: 100,
          playing: true,
          autoplay: false //new
        };
    
        let songInfo = null;
        let song = null;
    
        if (urlValid) {
          try {
            songInfo = await ytdl.getInfo(url);
            song = {
              title: songInfo.title,
              url: songInfo.video_url,
              duration: songInfo.length_seconds,
              id: songInfo.video_id
            };
          } catch (error) {
            if (error.message.includes("copyright")) {
              return message
                .reply("⛔ The video could not be played due to copyright protection ⛔")
                .catch(console.error);
            } else {
              console.error(error);
            }
          }
        } else {
          try {
            const results = await youtube.searchVideos(search, 1);
            songInfo = await ytdl.getInfo(results[0].url);
            song = {
              title: songInfo.title,
              url: songInfo.video_url,
              duration: songInfo.length_seconds,
              id: songInfo.video_id
            };
          } catch (error) {
            console.error(error);
          }
        }
    
        if (serverQueue) {
          serverQueue.songs.push(song);

          return serverQueue.textChannel
            .send(`\`\`\`✅ ${song.title} has been added to the queue by ${message.member.displayName}\`\`\``)
            .catch(console.error);
        } else {
          queueConstruct.songs.push(song);
        }
    
        if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);
    
        if (!serverQueue) {
          try {
            queueConstruct.connection = await channel.join();
            play(queueConstruct.songs[0], message);
          } catch (error) {
            console.error(`\n \`\`\`Could not join voice channel: ${error}\`\`\``);
            message.client.queue.delete(message.guild.id);
            await channel.leave(60000);
            return message.channel.send(`\n \`\`\`Could not join the channel: ${error}\`\`\``).catch(console.error);
          }
        }
    }
};