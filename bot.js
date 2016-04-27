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
  if ((text.toLowerCase().indexOf("whens") > -1) ||
  (text.toLowerCase().indexOf("when's") > -1)) {
    if (text.toLowerCase().indexOf("sf") > -1) {
      data("sf", function(streams) {
        var streamsLength = streams.length;
        if (streamsLength === 0) {
          bot.say(channel, "No streams, RIP SFV");
        } else {
          console.log("Stream count: " + streamsLength);
          var concatString = '';
          for (var i = 0; i < streamsLength; i++) {
            concatString += (streams[i].channel.url + " [" + streams[i].viewers + "] ");
          }
          bot.say(channel, "Top SFV Streams - " + concatString);
        }
      });
    } else if (text.toLowerCase().indexOf("gg") > -1) {
      data("gg", function(streams) {
        var streamsLength = streams.length;
        if (streamsLength === 0) {
          bot.say(channel, "No streams, RIP GG Xrd");
        } else {
          console.log("Stream count: " + streamsLength);
          var concatString = '';
          for (var i = 0; i < streamsLength; i++) {
            concatString += (streams[i].channel.url + " [" + streams[i].viewers + "] ");
          }
          bot.say(channel, "Top GG:Xrd Streams - " + concatString);
        }
      });
    } else if ((text.toLowerCase().indexOf("marvel") > -1) ||
    (text.indexOf("mahvel".toLowerCase()) > -1)) {
      data("marvel", function(streams) {
        var streamsLength = streams.length;
        if (streamsLength === 0) {
          bot.say(channel, "No streams, RIP Mahvel");
        } else {
          console.log("Stream count: " + streamsLength);
          var concatString = '';
          for (var i = 0; i < streamsLength; i++) {
            concatString += (streams[i].channel.url + " [" + streams[i].viewers + "] ");
          }
          bot.say(channel, "Top Marvel Streams - " + concatString);
        }
      });
    } else if (text.toLowerCase().indexOf("tekken") > -1) {
      bot.say(channel, "Real fgs only plz");
    }
  }
});

bot.addListener('message', function(from, to, text) {
  if (text.toLowerCase().indexOf("birdie") > -1) {
    if ((text.toLowerCase().indexOf("honest") > -1) || (text.toLowerCase().indexOf("retarded") > -1)) {
      bot.say(channel, "Birdie is the most honest char.");
    }
  }
});

bot.addListener('message', function(from, to, text) {
  if (text.toLowerCase().indexOf("slice you") > -1) {
    bot.say(channel, "SLICE YOU UP!");
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
  if (game.toLowerCase() === "sf") {
    url = "https://api.twitch.tv/kraken/streams?game=Street%20Fighter%20V&limit=5";
  } else if (game.toLowerCase() === "gg") {
    url = "https://api.twitch.tv/kraken/streams?game=Guilty%20Gear%20Xrd%20-Revelator-&limit=5";
  } else if (game.toLowerCase() === "marvel") {
    url = "https://api.twitch.tv/kraken/streams?game=Ultimate%20Marvel%20vs.%20Capcom%203&limit=5";
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
