var irc = require('irc');
var https = require("https");

var channel = "#IrishFightingGames";

console.log("Setting up client");
var bot = new irc.Client("servercentral.il.us.quakenet.org", "StreamMonster", {autoConnect: false});

bot.connect(5, function() {
  console.log("Connected!");
  bot.join(channel, function() {
    console.log("Joined playground");
  });
});

// list top 5 streams
bot.addListener('message', function(from, to, text) {
  console.log(from + ' => ' + to + ': ' + text);
  if (text.indexOf("whens".toLowerCase()) > -1) {
    if (text.indexOf("sf".toLowerCase()) > -1) {
      data("sf", function(streams) {
        var streamsLength = streams.length;
        console.log("Stream count: " + streamsLength);
        var concatString = '';
        for (var i = 0; i < streamsLength; i++) {
          concatString += (streams[i].channel.url + " [" + streams[i].viewers + "] ");
        }
        bot.say(channel, "Top SFV Streams - " + concatString);
      });
    } else if (text.indexOf("gg".toLowerCase()) > -1) {
      data("gg", function(streams) {
        var streamsLength = streams.length;
        console.log("Stream count: " + streamsLength);
        var concatString = '';
        for (var i = 0; i < streamsLength; i++) {
          concatString += (streams[i].channel.url + " [" + streams[i].viewers + "] ");
        }
        bot.say(channel, "Top GG:Xrd Streams - " + concatString);
      });
    } else if (text.indexOf("tekken".toLowerCase()) > -1) {
      bot.say(channel, "Real fgs only plz");
    }
  }
});

bot.addListener('message', function(from, to, text) {
  if (text.indexOf("birdie is an honest char".toLowerCase()) > -1) {
    bot.say(channel, "Birdie is the most honest of chars");
  }
});

bot.addListener('error', function(message) {
  console.log('error: ', message);
});
/**
 * Get a list of top streams for specified game.
 * @param {string} game - provide the acronym for the game you want to search for
 * @param {callback} callback - list of top streams as a JSONArray.
 */
function data(game, callback) {
  var url;
  if (game === "sf".toLowerCase()) {
    url = "https://api.twitch.tv/kraken/streams?game=Street%20Fighter%20V&limit=5";
  } else if (game === "gg".toLowerCase()) {
    url = "https://api.twitch.tv/kraken/streams?game=Guilty%20Gear%20Xrd%20-Revelator-&limit=5";
  }

  https.get(url, function(response) {
    var buffer = "";
    var data;

    response.on("data", function(chunk) {
      buffer += chunk;
    });

    response.on("end", function(err) {
      if (err) {
        console.error("Uh oh there was an error", err);
      } else {
        console.log("finished parsing");
        data = JSON.parse(buffer);
        var streams = data.streams;
        callback(streams);
      }
    });
  });
}
