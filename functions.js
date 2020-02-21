const fetch = require("node-fetch");
const ytdl = require("ytdl-core");

module.exports = {
    getMember: function(message, toFind = ""){
        toFind = toFind.toLowerCase();

        let target = message.guild.members.get(toFind);

        if(!target && message.mentions.members)
          target = message.mentions.members.first();
          
        if(!target && toFind){
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }
        if(!target)
          target = message.member;
        return target;
    },
    formatDate: function(date){
        return new Intl.DateTimeFormat('en-GB').format(date);
    },
    joinedPosition: function(message, member){

        let guild = message.member.guild;
        let ID = member.id;
        if (!guild.member(ID)) return; // It will return undefined if the ID is not valid

       let arr = guild.members.array(); // Create an array with every member
       arr.sort((a, b) => a.joinedAt - b.joinedAt); // Sort them by join date

       for (let i = 0; i < arr.length; i++) {
         //Loop though every element
         if (arr[i].id == ID) return ++i;// When you find the user, return it's position
        }
    },
    autoplay: async function(song, message){
        const config = {
            YT_ENDPOINT : "https://www.googleapis.com/youtube/v3/",
            YT_TOKEN: process.env.YOUTUBE_API_KEY,  
        };

        const channel = message.member.voiceChannel;

        if (!channel) return message.reply("\n \`\`\`You need to join a voice channel first!\`\`\`").catch(console.error);

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
        let videoId= null;

        if (serverQueue) {
             videoId = serverQueue.songs[0].id;
          } else {
            videoId = queueConstruct.songs[0].id;
          }
        
      
        try {
            const requestUrl = `${config.YT_ENDPOINT}search?part=id&relatedToVideoId=${videoId}&type=video&key=${config.YT_TOKEN}`;
    
            const ap = await fetch(requestUrl)
            .then(res => res.json())
            .then(json => json.items[1].id);

            songInfo = await ytdl.getInfo(ap.videoId);
            song = {
                title: songInfo.title,
                url: songInfo.video_url,
                duration: songInfo.length_seconds,
                id: songInfo.video_id
              };
          } catch (error) {
            console.error(error);
          }

        serverQueue.songs.shift();

          if (serverQueue) {
            serverQueue.songs.push(song);
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
}