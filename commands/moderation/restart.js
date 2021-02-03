const { Collection } = require("discord.js");
const fs = require("fs");
const config = require("../../settings/config.json");
const ownerID = config.ownerID
const client = this.client
 
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

module.exports = {
  name: "restart",
  category: "Owner Only",
  description: "Restart Project Codename: dsb",
  usage: "{PREFIX}restart",
  run: async (client, message, args) => {
		var start = new Date()
    //checks for owner out of the ownerID array
    if (!ownerID.includes(Number(message.author.id))) {
      message.channel.send("Hey! You aren't suposed to use that." + `\n` + "Only my owners can use `restart`.");
      return;
    }
		message.channel.send(`Bot restarting (We'll be right back in 10s)`)
		await sleep(1000);

    //clears console
    console.clear();
    //destroys client 
    client.destroy();
    //unloads the handler
    delete require.cache[require.resolve('../../handlers/command.js')];
		//unloads the music handler
		delete require.cache[require.resolve('../../handlers/music.js')];
		//unloads index.js
		delete require.cache[require.resolve('../../index.js')];
		await sleep(10000);
		require('../../index.js');
	}
}