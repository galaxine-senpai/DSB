const { MessageEmbed } = require("discord.js");
const queue = new Map();
const queueConstruct = {
 textChannel: null,
 voiceChannel: null,
 connection: null,
 queue: [],
 queueauthor: [],
 dispatcher: null
};
const ytdl = require('ytdl-core');

async function play(message, song, client) {
	const bot = client
	const serverQueue = queue.get(message.guild.id);
	if (!song) {
    serverQueue.voiceChannel.leave();
		serverQueue.textChannel.send(`No songs left in queue.`)
    queue.delete(message.guild.id);
    return;
  }
	var embed = new MessageEmbed()
		.setTitle(song.videoDetails.title.charAt(0).toUpperCase() + song.videoDetails.title.slice(1))
		.setURL(song.videoDetails.video_url)
		.setAuthor(`Now playing:`, bot.user.avatarURL() || bot.user.defaultAvatarURL)
		.setThumbnail(song.videoDetails.thumbnails[song.videoDetails.thumbnails.length-2].url)
		.addField(`Song description\:`, song.videoDetails.description.split('').slice(0,511).join('').split(`\n`).slice(0, song.videoDetails.description.split('').slice(0,511).join('').split(`\n`).length-2 || 1))
		.addField(`\👍`,song.videoDetails.likes,true)
		.addField(`\👎`,song.videoDetails.dislikes,true)
    .setColor("#FFDFD3")
		.setFooter(`Requested by ${serverQueue.queueauthor[0].tag}`, serverQueue.queueauthor[0].avatarURL() || serverQueue.queueauthor[0].defaultAvatarURL);
	if (serverQueue.queue[1] != undefined) {
		embed.addField(`Up next\:`, `\*\*${serverQueue.queue[1].videoDetails.title.charAt(0).toUpperCase() + serverQueue.queue[1].videoDetails.title.slice(1)}\*\* requested by \*\*${serverQueue.queueauthor[1].tag}\*\*`, true )
	} else {
		embed.addField(`Up next\:`, `Nothing`, true)
	}
	serverQueue.textChannel.send(embed) 
		serverQueue.dispatcher = serverQueue.connection
				.play(ytdl(song.videoDetails.video_url))
				.on("finish", () => {
					serverQueue.queue.shift();
					play(serverQueue.textChannel, serverQueue.queue[0], bot);
				})
				.on("error", error => console.error(error));
}

//summon command
module.exports.summon = async function summon(message) {

	serverQueue = queue.get(message.guild.id);

	//if inexistent creates it
	if (!serverQueue) {
		queue.set(message.guild.id, queueConstruct);
		serverQueue = queue.get(message.guild.id);
	}

	//defines user voicechannel
	var voiceChannel = message.member.voice.channel;

	//if the bot is not playing joins user vc
	if (serverQueue.queue != queueConstruct.queue) {
		message.channel.send("There's someone playing music in the server already.");
		return;
	}

	//checks if calling user in voiceChannel
	if (!voiceChannel) {
    message.channel.send("You need to be in a voice channel to summon me!");
		return;
	}
	
	//checks if bot has permission to join the channel and speak
	if (!voiceChannel.permissionsFor(message.client.user).has("CONNECT") || !voiceChannel.permissionsFor(message.client.user).has("SPEAK")) {
    message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
		return;
	};

	//sets voice and text cannel
	serverQueue.voiceChannel = voiceChannel;
	serverQueue.textChannel = message.channel;

	//sets queue to []
	serverQueue.queue = [];

	//conects and stores connection
	var connection = await voiceChannel.join();
	serverQueue.connection = connection;

	message.channel.send(`Joined \_\_${message.author}\_\_ in \_\_${voiceChannel.name}\_\_.`)
}

//disconnect command
module.exports.disconnect = async function disconnect(message) {

	var serverQueue = queue.get(message.guild.id);

	//if serverQueue inexistent creates it
	if (!serverQueue) {
		queue.set(message.guild.id, queueConstruct);
		var serverQueue = queue.get(message.guild.id);
	}

	//defines user voicechannel
	var voiceChannel = message.member.voice.channel;

	//if the bot is not playing joins user vc
	if (queueConstruct.voiceChannel === null) {
		message.channel.send("I am not connected to a voice channel.");
		return;
	};

	//checks if calling user in voiceChannel
	if (!voiceChannel || queueConstruct.voiceChannel != voiceChannel) {
    message.channel.send("You are not in the voice channel I am connected to.");
		return;
	};

	//Disconnects client
	serverQueue.connection.disconnect();

	//clears all data about guild off queue map
	queue.delete(message.guild.id);

	message.channel.send(`Left the \_\_${voiceChannel.name}\_\_ voice channel.`)

}

//play command
module.exports.play = async function(message, args, client) {

	//checks if arguments exist
	if (!args[0]) {
		message.channel.send(`You didn't provide any search query.`);
		return;
	}

	var serverQueue = queue.get(message.guild.id);

	//if inexistent creates it
	if (!serverQueue) {
		queue.set(message.guild.id, queueConstruct);
		var serverQueue = queue.get(message.guild.id);
	}

	//defines user voicechannel
	var voiceChannel = message.member.voice.channel;

	//checks the bot if the bot is playing and if the user is in the same voiceChannel
	if (serverQueue.queue != queueConstruct.queue && voiceChannel != serverQueue.voiceChannel) {
		message.channel.send("There's someone playing music in the server already.");
		return
	}

	//checks the bot if the bot is playing and if the user is in the same voiceChannel
	if (serverQueue.queue === queueConstruct.queue && voiceChannel != serverQueue.voiceChannel) {

		//checks if calling user in voiceChannel
		if (!voiceChannel) {
			message.channel.send("You need to be in a voice channel to play music!");
			return;
		}
		
		//checks if bot has permission to join the channel and speak
		if (!voiceChannel.permissionsFor(message.client.user).has("CONNECT") || !voiceChannel.permissionsFor(message.client.user).has("SPEAK")) {
			message.channel.send(
				"I need the permissions to join and speak in your voice channel!"
			);
			return;
		};

		//sets voice and text cannel
		serverQueue.voiceChannel = voiceChannel;
		serverQueue.textChannel = message.channel;


		//conects and stores connection
		var connection = await voiceChannel.join();
		serverQueue.connection = connection;

		message.channel.send(`Joined  \_\_${voiceChannel.name}\_\_ to play music.`)
	}

//	if (serverQueue.queue === queueConstruct.queue) {
		//checks arguments are a link
		if (ytdl.validateURL(args[0])) {
			//gets song 
			var song = await ytdl.getInfo(args[0]);
			serverQueue.queueauthor.push(message.author)
			serverQueue.queue.push(song);
		} else {
			console.log('not link');
			return;
		}
	if (!serverQueue.dispatcher) {
		play(message, song, client);
	}

}