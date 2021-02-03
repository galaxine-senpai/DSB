const config = require("../settings/config.json");
const prefix = require('discord-prefix');
 
//Requiring Packages
const Discord = require('discord.js'); 
const eco = require("discord-economy");
 

const client = new Discord.Client();
 
 	//Loads prefix from config.json
var defaultPrefix = config.prefix;
//get the prefix for the discord server
var guildPrefix = prefix.getPrefix(message.guild.id);
//set prefix to the default prefix if there isn't one
if (!guildPrefix) guildPrefix = defaultPrefix;
const settings = {
  prefix: guildPrefix
}
 

client.on('message', async message => {
 
  
  var command = message.content.toLowerCase().slice(settings.prefix.length).split(' ')[0];
 

  var args = message.content.split(' ').slice(1);
 
  
  if (!message.content.startsWith(settings.prefix) || message.author.bot) return;
 
  if (command === 'balance') {
 
    var output = await eco.FetchBalance(message.author.id)
    message.channel.send(`Hey ${message.author.tag}! You own ${output.balance} coins.`)
    return;
  }
 
  if (command === 'daily') {
 
    var output = await eco.Daily(message.author.id)
    //output.updated will tell you if the user already claimed his/her daily yes or no.
 
    if (output.updated) {
 
      var profile = await eco.AddToBalance(message.author.id, 100)
      message.reply(`You claimed your daily coins successfully! You now own ${profile.newbalance} coins.`);
 
    } else {
      message.channel.send(`Sorry, you already claimed your daily coins!\nBut no worries, over ${output.timetowait} you can daily again!`)
      return;
    }
 
  }
 
  if (command === 'leaderboard') {
 

    //If you put a mention behind the command it searches for the mentioned user in database and tells the position.
    if (message.mentions.users.first()) {
 
      var output = await eco.Leaderboard({
        filter: x => x.balance > 50,
        search: message.mentions.users.first().id
      })
      message.channel.send(`The user ${message.mentions.users.first().tag} is number ${output} on my leaderboard!`)
      return;
    } else {
 
      eco.Leaderboard({
        limit: 10, //Only takes top 10
        filter: x => x.balance > 50 //Only allows people with more than 100 balance
      }).then(async users => { 
        if (users[0]) var firstplace = await client.fetchUser(users[0].userid) //Searches for the user object in discord for first place
        if (users[1]) var secondplace = await client.fetchUser(users[1].userid) //Searches for the user object in discord for second place
        if (users[2]) var thirdplace = await client.fetchUser(users[2].userid) //Searches for the user object in discord for third place
 
        message.channel.send(`My Global leaderboard:
 
1 - ${firstplace && firstplace.tag || 'Nobody Yet'} : ${users[0] && users[0].balance || 'None'}
2 - ${secondplace && secondplace.tag || 'Nobody Yet'} : ${users[1] && users[1].balance || 'None'}
3 - ${thirdplace && thirdplace.tag || 'Nobody Yet'} : ${users[2] && users[2].balance || 'None'}`)
 
      })
 
    }
  }
 
  if (command === 'transfer') {
 
    var user = message.mentions.users.first()
    var amount = args[1]
 
    if (!user) return message.reply('Reply the user you want to send money to!')
    if (!amount) return message.reply('Specify the amount you want to pay!')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to transfer!')
 
    var transfer = await eco.Transfer(message.author.id, user.id, amount)
    message.reply(`Transfering coins successfully done!\nBalance from ${message.author.tag}: ${transfer.FromUser}\nBalance from ${user.tag}: ${transfer.ToUser}`)
    return;
  }
 
  if (command === 'coinflip') {
 
    var flip = args[0] //Heads or Tails
    var amount = args[1] //Coins to gamble
 
    if (!flip || !['heads', 'tails'].includes(flip)) return message.reply('Please specify the flip, either heads or tails!')
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')
 
    var gamble = await eco.Coinflip(message.author.id, flip, amount).catch(console.error)
    message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance}`)
    return;
  }
 
  if (command === 'dice') {
 
    var roll = args[0] //Should be a number between 1 and 6
    var amount = args[1] //Coins to gamble
 
    if (!roll || ![1, 2, 3, 4, 5, 6].includes(parseInt(roll))) return message.reply('Specify the roll, it should be a number between 1-6')
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')
 
    var gamble = await eco.Dice(message.author.id, roll, amount).catch(console.error)
    message.reply(`The dice rolled ${gamble.dice}. So you ${gamble.output}! New balance: ${gamble.newbalance}`)
    return;
 
  }
 
  if (command === 'work') {
 
    var output = await eco.Work(message.author.id)
    //50% chance to fail and earn nothing. You earn between 1-100 coins. And you get one out of 20 random jobs.
    if (output.earned == 0) return message.reply('Awh, you did not do your job well so you earned nothing!')
    message.channel.send(`${message.author.username}
You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}
You now own :money_with_wings: ${output.balance}`)
 
 
    var output = await eco.Work(message.author.id, {
      failurerate: 30,
      money: Math.floor(Math.random() * 500),
      jobs: ['cashier', 'shopkeeper', 'stripper', 'manager', 'bartender', 'pornstar']
    })
    //10% chance to fail and earn nothing. You earn between 1-500 coins. And you get one of those 3 random jobs.
    if (output.earned == 0) return message.reply('Awh, you did not do your job well so you earned nothing!')
 
    message.channel.send(`${message.author.username}
You worked as a \` ${output.job} \` and earned :money_with_wings: ${output.earned}
You now own :money_with_wings: ${output.balance}`)
return;
  }
 
  if (command === 'slots') {
 
    var amount = args[0] //Coins to gamble
 
    if (!amount) return message.reply('Specify the amount you want to gamble!')
 
    var output = await eco.FetchBalance(message.author.id)
    if (output.balance < amount) return message.reply('You have fewer coins than the amount you want to gamble!')
 
    var gamble = await eco.Slots(message.author.id, amount, {
      width: 3,
      height: 1
    }).catch(console.error)
    message.channel.send(gamble.grid)//Grid checks for a 100% match vertical or horizontal.
    message.reply(`You ${gamble.output}! New balance: ${gamble.newbalance}`)
    return;
  }
  
});
 

