
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const config = require("../../settings/config.json");
const prefix = require('discord-prefix');

// generates the emote menu
async function menu(prefix, message, client) {
	//loads command shortdescription
	var shortdescription = function(cmd) {
		if (!cmd.shortdescription) {
			return ""
		} else {
			return " - " + cmd.shortdescription;
		}
	}

	//creates ArrayEmbed
	const ArrayEmbed = new Array();


	//fetches categories
	var info = client.categories
				.filter(cat => cat.split("")[0].match(/[a-z]/gi))
        .map(cat => stripIndents`${cat[0].toUpperCase() + cat.slice(1)}`)
				.sort();
		// fetches matches comands with category  
	var commands = (category) => {
        return client.commands
						.filter(cmd => cmd.category != undefined)
            .filter(cmd => cmd.category.toLowerCase() === category.toLowerCase())
            .map(cmd => `${cmd.name.toLowerCase()}`)
						.sort()
						.join(`\n`)
	}
	
	// Creates embeds for each category and adds to ArrayEmbed
	for (i=0; i<info.length; i++) {
		let embed = new MessageEmbed()
				.setTitle(`Help menu`)
				.setURL('https://youtu.be/YmAXwLd4-os')
				.setDescription(`For more info about a command use ${prefix}help \[command\]`)
				.addField(info[i], commands(info[i]))
        .setColor("#FFDFD3")
				.setTimestamp()
				.setFooter(`Page ${i+1} out of ${info.length}`, client.user.displayAvatarURL());
		ArrayEmbed.push(embed);
	}

	// saves embed msg
	var cpage = 0;
	var reactmsg = await message.channel.send(ArrayEmbed[cpage]);
	
	//adds reactions to the embed
	reactmsg.react("⏪");
	reactmsg.react("◀️");
	reactmsg.react("⏹️");
	reactmsg.react("▶️");
	reactmsg.react("⏩");
	reactmsg.react("🔢");

	// creates reactions colector
	var filter = (reaction, user) => {
		return user.id === message.author.id
	};
	const reactcollector = reactmsg.createReactionCollector(filter, { idle: 60000, dispose: true });

	reactcollector.on('collect', (reaction, user) => {
		//First page
		if (reaction.emoji.name === "⏪") {
			cpage = 0;
			reactmsg.edit(ArrayEmbed[cpage])
		};

		//Last page
		if (reaction.emoji.name === "◀️") {
			if (cpage!=0) {
				cpage += -1;
				reactmsg.edit(ArrayEmbed[cpage])
			}
		};

		//Stop
		if (reaction.emoji.name === "⏹️") {
			reactcollector.stop();
		};

		//Next page
		if (reaction.emoji.name === "▶️") {
			if (cpage != info.length - 1) {
				cpage += 1;
				reactmsg.edit(ArrayEmbed[cpage])
			}
		};

		//Last page
		if (reaction.emoji.name === "⏩") {
			cpage = info.length-1;
			reactmsg.edit(ArrayEmbed[cpage])
		};

		//Go to page
		if (reaction.emoji.name === "🔢") {
			//Request message
			reactmsg.channel.send(`Write the numer of the page you want jump to.`)
					.then(msg => {
   						msg.delete({timeout: 10000})
 					});

			//Await message
			message.channel.awaitMessages(m => m.author === message.author, { max: 1, time: 30000, errors: ['time'] })
				.then(collected => {
					//check if value collected is valid
					if (parseInt(collected.first().content) > 0 && parseInt(collected.first().content) <= info.length) {
						cpage = parseInt(collected.first().content) - 1;
						reactmsg.edit(ArrayEmbed[cpage]);
					} else {
						message.channel.send(`\`${collected.first().content}\` is not a valid page!`)
								.then(msg => {
   								 msg.delete({timeout: 5000})
 								 });
					}
					collected.first().delete({timeout: 250});
				})
				.catch(collected => {
					message.channel.send('Timed out after no response in 15s.')
							.then(msg => {
   								msg.delete({timeout: 5000})
 							});
				});
		}

		//Clear user reaction
		reaction.users.remove(user.id);
	});

	reactcollector.on('end', collected => {
		reactmsg.reactions.removeAll()
	});

}

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
		shortdescription: "Provides help",
    description: "Returns all commands, or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args) => {
				//Loads prefix from config.json
				var defaultPrefix = config.prefix;
				//get the prefix for the discord server
				var guildPrefix = prefix.getPrefix(message.guild.id);
				//set prefix to the default prefix if there isn't    
				if (!guildPrefix) guildPrefix = defaultPrefix;
        // If there's an args found
        // Send the info of that command found
        // If no info found, return not found embed.
        if (args[0]) {
            return getCMD(client, message, args[0]);
        } else {
            // Otherwise send all the commands available
            // Without the cmd info
            menu(guildPrefix, message, client);
        }
    }
}
/*   COMENTED OUT
function getAll(client, message) {
    const embed = new MessageEmbed()
        .setColor("#FFDFD3")
        .setThumbnail("https://cdn.discordapp.com/avatars/546100087579738133/ea87b6e238044da37381c2277987fd3e.webp")
        .setTitle('Help Menu')
        .setURL('https://cdn.discordapp.com/attachments/760546704582901810/797042688892338196/video0_1.mp4')
        .setFooter("To see command descriptions and usage type .help [CMD Name]")
        
    // Map all the commands
    // with the specific category
    const commands = (category) => {
        return client.commands
            .filter(file => file.endsWith(".js"))
            .filter(file => file.endsWith(".js"))
            .map(cmd => `\`${cmd.name}\``)
            .join(", ");
    }

    // Map all the categories
    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

        message.reply('Sent help to dms')

        

    return message.author.send(embed.setDescription(info));
    
}*/

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    // Get the cmd by the name or alias
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));
    
    let info = `No information found for command **${input.toLowerCase()}**`;

    // If no cmd is found, send not found embed
    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    // Add all cmd info to the embed
    if (cmd.name) info = `**Command name**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**Aliases**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**Description**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**Usage**: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}