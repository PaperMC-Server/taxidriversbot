const Discord = require("discord.js");

const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setActivity(`${client.users.size} leden!`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`${client.users.size} leden!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`${client.users.size} leden!`);
});


client.on("message", async message => {
  if(message.author.bot) return;
  
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  

  if(command === "say") {
    if(!message.member.roles.some(r=>["🚕 - Beheer | Team"].includes(r.name)) )
    return; const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{}); 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    if(!message.member.roles.some(r=>["🚖 - Management | Medw", "🚕 - Beheer | Team"].includes(r.name)) )
      return message.reply("Je hebt hier geen permissions voor!");
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Deze gebruiker bestaat niet of zit niet in deze discord!");
    if(!member.kickable) 
      return message.reply("Ik kan deze persoon niet kicken! Zijn role staat hoger als die van mijn!");
    
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Wij zijn niet verplicht een reden te geven!";

    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} Ik kan deze persoon niet kicken omdat ${error}`));
    message.reply(`${member.user.tag} is gekickt door ${message.author.tag} voor de reden ${reason}`);

  }
  
  if(command === "ban") {

    if(!message.member.roles.some(r=>["🚖 - Management | Medw", "🚕 - Beheer | Team"].includes(r.name)) )
      return message.reply("Je hebt hier geen permissions voor!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Deze gebruiker bestaat niet of zit niet in deze discord!");
    if(!member.bannable) 
      return message.reply("Ik kan deze persoon niet bannen! Zijn role staat hoger als die van mij!");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "Wij zijn niet verplicht een reden te geven!";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} Ik kan deze persoon niet bannen omdat ${error}!`));
    message.reply(`${member.user.tag} is verbannen door ${message.author.tag} voor de reden ${reason}`);
  }

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Ik kan dit bericht niet verwijdere omdat ${error}`));
  }
);
  client.on('guildMemberAdd', member => {
    console.log('User' + member.user.tag + 'is nieuw');
  
    var role = member.guild.roles.find('name', 'user');
    member.addRole(`679786340551884856`); // Replace dit naar role id van TaxiDrivers
    
  });
//Ticket System en Order System

var prefix = config.prefix;
client.on("message", (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
  
    if (message.content.toLowerCase().startsWith(prefix + `help`)) {
      const embed = new Discord.RichEmbed()
      .setTitle(`:oncoming_taxi: TaxiDrivers | Help`)
      .setColor(15105570)
      .setDescription(`Hallo wij zijn TaxiDrivers! hier zijn de commands:`)
      .addField(`Tickets/Orders`, `[${prefix}new]() | Om een ticket of order te openen!\n[${prefix}close]() | Om je ticket te sluiten!`)
      .addField(`Ander`, `[${prefix}help]() | Laat je dit menu zien!\n[${prefix}ping]() | Vertelt je wat je ping is!`)
      message.channel.send({ embed: embed });
    }
  
    if (message.content.toLowerCase().startsWith(prefix + `ping`)) {
      message.channel.send(`Even geduld!`).then(m => {
      m.edit(`:ping_pong: Connectie Info: ` + `DiscordAPI Connection: ` + Math.round(client.ping) + `ms.`);
      });
  }
  
  if (message.content.toLowerCase().startsWith(prefix + `new`, `order`, `ticket`)) {
      const reason = message.content.split(" ").slice(1).join(" ");
      if (!message.guild.roles.exists("name", "Support Team")) return message.channel.send(`Maak een \`Support Team\` role of neem contact op met een admin`);
      if (message.guild.channels.exists("name", "ticket-" + message.author.username)) return message.channel.send(`**FOUT** Je hebt al een openstaande ticket/order`);
      message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
          let role = message.guild.roles.find("name", "🙋 - Support Team");
          let role2 = message.guild.roles.find("name", "@everyone");
          c.setParent(`681564548875943939`)
          c.overwritePermissions(role, {
              SEND_MESSAGES: true,
              READ_MESSAGES: true
          });
          c.overwritePermissions(role2, {
              SEND_MESSAGES: false,
              READ_MESSAGES: false
          });
          c.overwritePermissions(message.author, {
              SEND_MESSAGES: true,
              READ_MESSAGES: true
          });
          message.channel.send(`:upcoming_taxi: Je ticket is gemaakt! kijk in #${c.name}.`);
          const embed = new Discord.RichEmbed()
          .setColor(15105570)
          .addField(`Beste ${message.author.username}!`, `Probeer uit te leggen waarom je deze ticket/order geopend hebt! het **Support Team** Is onderweg! (Tag @here)`)
          .setTimestamp();
          c.send({ embed: embed });
      }).catch(console.error);
  }
  if (message.content.toLowerCase().startsWith(prefix + `close`, `sluit`)) {
      if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`Je kan een ticket niet sluiten buiten het ticket kanaal!`);
  
      message.channel.send(`Weet je zeker dat je de ticket/order wilt sluiten?\ntyp \`-confirm\`. Doe dit binnen 10 seconden anders verloopt deze actie!`)
      .then((m) => {
        message.channel.awaitMessages(response => response.content === '-confirm', {
          max: 1,
          time: 10000,
          errors: ['time'],
        })
        .then((collected) => {
            message.channel.delete();
          })
          .catch(() => {
            m.edit('Je verzoek om je ticket/order te sluiten is verlopen!').then(m2 => {
                m2.delete();
            }, 3000);
          });
      });
  }
});  


client.login(process.env.token);