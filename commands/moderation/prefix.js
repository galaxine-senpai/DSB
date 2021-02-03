const prefix = require('discord-prefix');
const config = require("../../settings/config.json");

module.exports = {
    name: "prefix",
    aliases: ["setprefix"],
    category: "moderation",
    description: "Helps changing the server prefix",
    usage: "<command | alias> [prefix | reset]",
    run: async (client, message, args) => {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
          message.channel.send("You are missing permissions: `ADMINISTRATOR`");
          return;
        }
            //Loads prefix from config.json
        let defaultPrefix = config.prefix;
        //get the prefix for the discord server
        let guildPrefix = prefix.getPrefix(message.guild.id);
        //set prefix to the default prefix if there isn't one
        if (!guildPrefix) guildPrefix = defaultPrefix;
        if (!args[0]) {
        message.channel.send("The current prefix is `" + guildPrefix + "`.");
        } else {
          if (args[0] === "reset") {
            prefix.setPrefix(config.prefix , message.guild.id)
            message.channel.send(`The prefix was reset succesfully back to \`${config.prefix}\`\.`)
          } else {
            prefix.setPrefix(args[0] , message.guild.id)
            message.channel.send(`The prefix was succesfully set to \`${args[0]}\`\.`)
          }
        }
    }
}