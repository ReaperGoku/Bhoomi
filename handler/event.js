const { readdirSync } = require("fs");

module.exports = (client) => {
  readdirSync("./events/").forEach(dir => {

    const events = readdirSync(`./events/${dir}/`).filter(f => f.endsWith(".js"));

    for (let file of events){ 

        const evt = require(`../events/${dir}/${file}`)

        let eName = file.split(".")[0];
        
        client.on(eName, evt.bind(null, client));
    };
  });
};