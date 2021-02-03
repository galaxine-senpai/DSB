//Modules
const { Client, Collection } = require("discord.js");
const config = require("./settings/config.json");
const prefix = require('discord-prefix');
const fs = require("fs");
const Express = require("./express.js");


const client = new Client({
//Stops the bot from mentioning @everyone
disableEveryone: true
});

//Command Handler
client.commands = new Collection();
client.aliases = new Collection();

//Command Folder location
client.categories = fs.readdirSync('./commands/');

["command"].forEach(handler => {
    const command = require(`./handlers/${handler}`);
    command.load(client)
});

//Bot Status
client.on("ready", () => {
console.log(`Bot User ${client.user.username} has been logged in and is ready to use!`);
client.user.setActivity('TESTING PHASE: ALPHA CODENAME:DSB | d.help', { type: 'WATCHING' });
});

client.on("message", async message => {
		//loads economy db

    //Loads prefix from config.json
    let defaultPrefix = config.prefix;
    //get the prefix for the discord server
    let guildPrefix = prefix.getPrefix(message.guild.id);
    //set prefix to the default prefix if there isn't one
    if (!guildPrefix) guildPrefix = defaultPrefix;

    //Checks if the command starts with a prefix
    if (!message.content.startsWith(guildPrefix)) {
      // checks for @everyone and @here
        if (message.content.includes("@here") || message.content.includes("@everyone")) return;
      // Checks if bot user got mentioned
        if (message.mentions.has(client.user.id)) {
          message.channel.send (`Hey\! My prefix is \`${guildPrefix}\``);
					return;
        };
				return;
    };
    //Makes sure bot wont respond to other bots including itself
    if (message.author.bot) return;
    //Checks if the command is from a server and not a dm
    if (!message.guild) return;

    const args = message.content.slice(guildPrefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    //message.content.startsWith(guildPrefix)
    if (cmd.length === 0) return;
    
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));

    if (command) {
        command.run(client, message, args)
        return;
    }
});

client.login(process.env.TOKEN);