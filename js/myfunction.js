// Initialize Firebase
var config = {
    apiKey: "AIzaSyBOJTVDE1wEf-wXg_enh7KpNzxCWyXozvY",
    authDomain: "matcher-49d51.firebaseapp.com",
    databaseURL: "https://matcher-49d51.firebaseio.com",
    //projectId: "matcher-49d51",
    storageBucket: "matcher-49d51.appspot.com",
    //messagingSenderId: "762247348350"
};
firebase.initializeApp(config);

//Reference messages collection
var summonerRef = firebase.database().ref('summoners');

//////////////////////////////////////////////////////////////////////////

var https = 'https://'
var summonerLink = 'api.riotgames.com/lol/summoner/v3/summoners/by-name/'
var rankLink = 'api.riotgames.com/lol/league/v3/positions/by-summoner/';
var API_KEY = '?api_key=RGAPI-541dc2d7-60b4-41d9-9338-c74729079155';
var region;
var fullSummonerLink;
var fullRankLink;

//Get the region of the player
function getRegion() {
    if (document.getElementById('na').checked) {
        region = document.getElementById('na').value;
    } else if (document.getElementById('eu').checked) {
        region = document.getElementById('eu').value;
    } else if (document.getElementById('kr').checked) {
        region = document.getElementById('kr').value;
    }
}

//Submitted button was clicked
function submitted() {
    getRegion();
    var userId;
    var flexTier;
    var flexRank;
    var soloTier;
    var soloRank;
    var userIgn = document.getElementById("ign").value;
    var roles = {
        top: checkBox('top'), 
        jg: checkBox('jg'), 
        mid: checkBox('mid'), 
        adc: checkBox('adc'), 
        supp: checkBox('supp'), 
        fill: checkBox('fill')
    };
    var gameType = {
        soloduo: checkBox('soloduo'),
        flex: checkBox('flex'),
        norm: checkBox('norm'),
        aram: checkBox('aram')
    };
    var gof = {
        grind: checkBox('grind'),
        fun: checkBox('fun')
    };
    var micAvail = checkBox('yes');
    var notes = document.getElementById('notes').value;

    fullSummonerLink = https + region + summonerLink + userIgn + API_KEY;

    $.getJSON('https://json2jsonp.com/?url=' + fullSummonerLink +'&callback=?', function(data) {
        userId = data['id'];
    }).then(function() {
        fullRankLink = https + region + rankLink + userId + API_KEY;

        $.getJSON('https://json2jsonp.com/?url=' + fullRankLink +'&callback=?', function(data) {
            flexTier = data[0]['tier'];
            flexRank = data[0]['rank'];
            soloTier = data[1]['tier'];
            soloRank = data[1]['rank'];
            
            saveSummoner(region, userId, userIgn, roles, gameType, gof, micAvail, flexTier, flexRank, soloTier, soloRank, notes);
        });
    });

    // $.ajax({
    //     url: 'https://json2jsonp.com/?url=' + fullSummonerLink +'&callback=?',
     
    //     // The name of the callback parameter, as specified by the YQL service
    //     jsonp: "callback",
     
    //     // Tell jQuery we're expecting JSONP
    //     dataType: "jsonp",

    //     type: "GET",
    //     jsonpCallback: "callback",

    //     // Work with the response
    //     success: function( data ) {
    //         console.log( data ); // server response
    //         userId = data['id'];
    //         console.log(userId);
    //         getRank();
    //     }
    // });

    //loadJSON(fullink, asdfasdf, 'jsonp');

    // fetch(fullink)
    // .then(function(data) {
    //     console.log(data);
    // })
}

//pushes the information to the firebase database
function saveSummoner(region, userId, ign, roles, gameType, gof, micAvail, flexTier, flexRank, soloTier, soloRank, notes) {
    var newSummonerRef = summonerRef.push();
    newSummonerRef.set({
        region: region,
        userId: userId,
        userIgn: ign,
        roles: roles,
        gameType: gameType,
        gof: gof,
        micAvail: micAvail,
        flexTier: flexTier,
        flexRank: flexRank,
        soloTier: soloTier,
        soloRank: soloRank,
        notes: notes
    });
}

//checks for user's inputs of the checkboxes
function checkBox(choice) {
    console.log(choice);
    if (document.getElementById(choice).checked)
        return true;
    else
        return false;
}