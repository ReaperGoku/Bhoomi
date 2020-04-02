const { play } = require("../../include/play");
const YouTubeAPI = require("simple-youtube-api");

module.exports = {
    name : "playlist",
    aliases : ["list"],
    category: "music",
    description : "Play a playlist from youtube",
    usage: "[ Playlist URL | Playlist Name ]",

    run : async(client, message, args) => {
        const config = {
            YOUTUBE_API_KEY : process.env.YOUTUBE_API_KEY,
            YOUTUBE_API_KEY1 : process.env.YOUTUBE_API_KEY1,
            MAX_PLAYLIST_SIZE : 10
        };

        const youtube = new YouTubeAPI(config.YOUTUBE_API_KEY);
        const youtube1 = new YouTubeAPI(config.YOUTUBE_API_KEY1);

        const channel = message.member.voice.channel;

    if (!args.length)
      return message.channel.send("\`\`\`Usage: /playlist <YouTube Playlist URL | Playlist Name>\`\`\`").catch(console.error);
    if (!channel) return message.channel.send("\`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);

    const permissions = channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT"))
      return message.channel.send("\`\`\`Cannot connect to voice channel, missing permissions\`\`\`");
    if (!permissions.has("SPEAK"))
      return message.channel.send("\`\`\`I cannot speak in this voice channel, make sure I have the proper permissions!\`\`\`");

    const search = args.join(" ");
    const pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
    const url = args[0];
    const urlValid = pattern.test(args[0]);

    const serverQueue = message.client.queue.get(message.guild.id);
    const queueConstruct = {
      guild : message.guild,
      textChannel: message.channel,
      channel : channel,
      connection: null,
      songs: [],
      loop: false,
      volume: 50,
      playing: true,
      autoplay: false
    };

    let song = null;
    let playlist = null;
    let videos = [];

    if (urlValid) {
      try {
        playlist = await youtube.getPlaylist(url, { part: "snippet" });
        videos = await playlist.getVideos(MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const results = await youtube.searchPlaylists(search, 1, { part: "snippet" });
        playlist = results[0];
        videos = await playlist.getVideos(config.MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
      } catch (error) {
        console.error(error);
        try {
          const results = await youtube1.searchPlaylists(search, 1, { part: "snippet" });
          playlist = results[0];
          videos = await playlist.getVideos(config.MAX_PLAYLIST_SIZE || 10, { part: "snippet" });
        } catch (error) {
          console.error(error);
        }
      }
    }

    videos.forEach(video => {
      song = {
        title: video.title,
        url: video.url,
        duration: video.durationSeconds
      };

      if (serverQueue) {
        let clientVoiceConnection = message.guild.voice.connection;

        if (!clientVoiceConnection.voice.channel.members.has(message.member.id))
        return message.channel.send(`\`\`\`You need to join a voice channel ${serverQueue.channel.name}\`\`\``).catch(console.error);
        
        serverQueue.songs.push(song);
        message.channel
          .send(`\n \`\`\`✅ ${song.title} has been added to the queue by ${message.member.displayName}\`\`\``)
          .catch(console.error);
      } else {
        queueConstruct.songs.push(song);
      }
    });

    message.channel
      .send("\n" +
        `\`\`\`${message.member.displayName} 📃 Added a playlist - ${playlist.title} <${playlist.url}>

        ${queueConstruct.songs.map((song, index) => index + 1 + ". " + song.title).join("\n")}
        \`\`\``,
        { split: true }
      )
      .catch(console.error);

    if (!serverQueue) message.client.queue.set(message.guild.id, queueConstruct);

    if (!serverQueue) {
      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0], message);
      } catch (error) {
        console.error(`\`\`\`Could not join voice channel: ${error}\`\`\``);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`\`\`\`Could not join the channel: ${error}\`\`\``).catch(console.error);
      }
    }
    }
};
