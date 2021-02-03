const { Collection } = require("discord.js");
const fs = require("fs");
const config = require("../../settings/config.json");
const ownerID = config.ownerID
 
module.exports = {
  name: "reload",
  category: "Owner Only",
  description: "Reloads commands of Project Codename: dsb",
  usage: "{PREFIX}reload",
  run: async (client, message, args) => {
    //checks for owner out of the ownerID array
    if (!ownerID.includes(Number(message.author.id))) {
      message.channel.send("Hey! You aren't suposed to use that." + `\n` + "Only my owners can use `reload`.");
      return;
    }
    //if no arguments given
    if(!args[0]) {
      //Command Handler
      client.commands = new Collection();
      client.aliases = new Collection();

      //Command Folder location
      client.categories = fs.readdirSync('./commands');
      ["command"].forEach(handler => {
        
        const commandhandler = require(`../../handlers/${handler}`);
        var load = commandhandler.load(client)

        message.channel.send(load)
      });
			//unloads the music handler
			delete require.cache[require.resolve('../../handlers/music.js')];
      
    } else {
      client.categories = fs.readdirSync('./commands');
      ["command"].forEach(handler => {
        const commandhandler = require(`../../handlers/${handler}`);
        var load = commandhandler.load(client, args[0])
        message.channel.send(load)
      });
    }
  }
}
