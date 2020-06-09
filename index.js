const Discord = require("discord.js");
const fetch = require("node-fetch");
const {prefix, token, apiKey} = require("./config.json");
const Cache = require("./cache.js");

const client = new Discord.Client();

client.once("ready", () => {
  console.log("Ready!");
});

//fetch functions

const fetchNewsData = () => {
  return fetch(`https://api.hypixel.net/skyblock/news?key=${apiKey}`).then(res => res.json());
}

//initialize data Cache

const newsCache = new Cache(fetchNewsData);

client.on("message", (message) => {
  if (message.author.bot || !(message.content.startsWith(prefix))) return;
  const args = message.content.slice(prefix.length).split(' ');
  const command = args.shift().toLowerCase();

  if (message.content === "sbn get latest") {
    newsCache.getData().then((json) => {
      var embeded = {
        title: json.items[0].title,
        url: json.items[0].link,
        description: json.items[0].text
      };
      message.channel.send({embed: embeded});
    });
  } else if (args[0] === "list") {
  /*fetch(`https://api.hypixel.net/skyblock/news?key=${apiKey}`).then(res => res.json()).then((json) => {
      var embeded  = {
        title: "Skyblock News",
        fields: []
      };
      for (var i = 1; i < json.items.length; i++) {
        embeded.fields.push({ name: json.items[i].title + " - " + i, value: json.items[i].text});
      }
      message.channel.send({embed: embeded});
    })*/
    newsCache.getData().then((json) => {
      var embeded = {
        title: "Skyblock News",
        fields: []
      };
      for (var i = 0; i < json.items.length; i++) {
        embeded.fields.push({name: json.items[i].title + " - " + i, value: json.items[i].text});
      }
      message.channel.send({embed: embeded});
    })
  } else if (args[0] === "get") {
    try {
    /*fetch(`https://api.hypixel.net/skyblock/news?key=${apiKey}`).then(res => res.json()).then((json) => {
        var list = [];
        for (var i = 1; i < json.items.length; i++) {
          list.push(json.items[i]);
        }
        var embeded = {
          title: list[args[1]].title,
          url: list[args[1]].link,
          description: list[args[1]].text
        }
        message.channel.send({ embed: embeded});
      });*/

      newsCache.getData().then((json) => {
        var list = [];
        for (var i =0;i < json.items.length; i++) {
          list.push(json.items[i]);
        }
        if (list[args[1]]) {
          var embeded = {
            title: list[args[1]].title,
            url: list[args[1]].link,
            description: list[args[1]].text
          }
          message.channel.send({embed: embeded});
        } else {
          message.channel.send("Is that a valid news id?");
        }
      });
    } catch (e) {
      message.channel.send("Looks like something went wrong. Is that a valid news id?");
    }
  }
});

client.login(token);
