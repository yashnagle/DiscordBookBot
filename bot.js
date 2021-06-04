require('dotenv').config();
const http = require('https');
const _ = require('underscore');
const fetch = require('node-fetch');
//Getting the bot online
// const { Client, Message } = require('discord.js'); //importing a class from discord.js library

const { Client } = require('discord.js');
const { Http2ServerRequest } = require('http2');

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});
const PREFIX = "$";

client.on('ready', ()=>{
    console.log(`${client.user.tag}`+' has landed'); 
}) //to register an event, 'ready'->name of event

client.on('ready', ()=>{
    console.log(`${client.user.username}`+' has landed'); 
})

//Returns the message and the user 
// client.on('message', (message)=>{
//     console.log(message.author.username+' wrote '+ message.content); 
// })

// client.on('message', (message)=>{
//     console.log(message.content); 
// })
client.login(process.env.DISCORD_BOT_TOKEN);


//replying 
client.on('message', (message)=>{
    console.log(`[${message.author.tag}]: ${message.content}`); 

    if(message.content === 'hello' || message.content === 'hi'||message.content === 'Hello' || message.content === 'Hi'){
        if(message.author.bot) return; 
        if(message.author.bot === false){
        message.reply('Hello there!')
        message.channel.send('Hi' + ` ${message.author.username}`);
        }
        
    }
})

// client.on('message', (message)=>{
//     if(message.content.startsWith(PREFIX)){
//         const [CMD_NAME, ...args] = message.content //... is the spreader operator
//         .trim()
//         .substring(1)
//         .split(/\s+/);
//         // console.log(CMD_NAME);
//         // console.log(args)

//         if(CMD_NAME === 'kick'){
//             if(!message.member.hasPermission('KICK_MEMBERS')) return message.reply('You do not have permissions to use this command');
//             if(args.length === 0) return message.reply('Please provide an id');

//             const member = message.guild.members.cache.get(args[0])
//             console.log(member);

//             if(member){
//                 member
//                 .kick()
//                 .then((member) => message.channel.send(`${member} was kicked.`))
//                 .catch((err) => message.channel.send('I do not have permissions to kick this user'));
//             }
//             else{
//                 message.reply('Member not found');
//                 message.channel.send('Member not found');
//             }
//         }
//     }
// })

// client.on('messageReactionAdd', (reaction, user) => {
//     console.log('Hello');
//     const { name } = reaction.emoji;
//     const member = reaction.message.guild.members.cache.get(user.id);
//     if(reaction.message.id === '847001062186942474'){
//         switch(name){
//             case '🍎':
//                 member.roles.add('846999570494914560');
//                 break;
//             case '🍌':
//                 member.roles.add('846999597436108840');
//                 break;
//             case '🍑':
//                 member.roles.add('846999660488163348');
//                 break;
//             case '🍇':
//                 member.roles.add('846999971483877376');
//                 break;
//         }

//     }
// });
let b = 0;
let url1;
//Searching for books
client.on('message', (message)=>{
    if(b === 1) return;
    b = 1;
    if(message.content.startsWith(PREFIX)){//$
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(1)
        .split(/\s+/);

        if(CMD_NAME === 'bookInfo'){
            message.reply('Gotcha');
            message.reply('This is what I found, select one');

            let urlFirst = 'https://www.googleapis.com/books/v1/volumes?q=';
            // const api_key = 
            let urlLast = 'author:keyes&key='+process.env.API_KEY;
            let urlMiddle = '';
            console.log(args);
            for(let i =0; i < args.length; ++i){
            urlMiddle = urlMiddle + args[i];
            if(i !== args.length - 1){
            urlMiddle = urlMiddle + '+';
            }
            }
            let url = urlFirst + urlMiddle + urlLast;
            console.log(url)
            url1 = url;
            // http.get(url, (ele)=>{
            //     console.log(JSON.stringify(ele));
            // })

            // console.log(url);
            // const data = require(url, (data)=>{
            //     console.log(data);
            // });

            
            let jsonF;
            fetch(url)
            .then(res => res.json())
            .then(json => {
                // message.reply(`[Title]: `+json.items[0].volumeInfo.title);
                // message.reply(`[Author]: `+json.items[0].volumeInfo.authors[0]);
                // message.reply(`[Description]: `+json.items[0].volumeInfo.description);
                // message.reply(`[Average Rating]: `+json.items[0].volumeInfo.averageRating);
                // message.reply();
                console.log(json.items.length);
                for(let i =0; i<json.items.length;++i){
                    message.reply((i+1)+'.[Title]: '+json.items[i].volumeInfo.title+ '\n\t[Author]: '+json.items[i].volumeInfo.authors[0]);
                }
                message.reply('Choose one, enter -1 to stop');
                 
            })

        }
    }
})


client.on('message', (message)=>{
    if(b === 0) return;

    b = 0;
    let a = parseInt(message.content);
    if(a == -1)return message.reply('Search Stopped');
    fetch(url1)
            .then(res => res.json())
            .then(json => {
                message.reply(`[Title]: `+json.items[a-1].volumeInfo.title);
                message.reply(`[Author]: `+json.items[a-1].volumeInfo.authors[0]);
                message.reply(`[Description]: `+json.items[a-1].volumeInfo.description);
                message.reply(`[Average Rating]: `+json.items[a-1].volumeInfo.averageRating);
            })
})
// function gotData(data){
//     console.log(data);
// }