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
var API_KEY = '?api_key=RGAPI-c7d52263-4ca5-4c03-95a3-460a77f9e657';
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
    var flexRankNumber;
    var soloRankNumber;
    var grindorfun = grindFun();
    var userIgn = document.getElementById("ign").value;
    var roles = {
        top: document.getElementById('top').checked, 
        jg: document.getElementById('jg').checked, 
        mid: document.getElementById('mid').checked, 
        adc: document.getElementById('adc').checked, 
        supp: document.getElementById('supp').checked, 
        fill: document.getElementById('fill').checked
    };
    var gameType = {
        soloduo: document.getElementById('soloduo').checked,
        flex: document.getElementById('flex').checked,
        norm: document.getElementById('norm').checked,
        aram: document.getElementById('aram').checked
    };
    var micAvail = checkMic();
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

            flexRankNumber = calcTier(flexTier);
            soloRankNumber = calcTier(soloTier);
            
            if (flexRankNumber < 25 && flexRankNumber >= 0)
                flexRankNumber += calcRank(flexRank);
            if (soloRankNumber < 25 && soloRankNumber >= 0)
                soloRankNumber += calcRank(soloRank);
            
            saveSummoner(region, userId, userIgn, roles, gameType, grindorfun, micAvail, flexRankNumber, soloRankNumber, notes);
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
function saveSummoner(region, userId, ign, roles, gameType, grindorfun, micAvail, flexRankNumber, soloRankNumber,notes) {
    var newSummonerRef = summonerRef.push();
    newSummonerRef.set({
        region: region,
        userId: userId,
        userIgn: ign,
        roles: roles,
        gameType: gameType,
        grindorfun: grindorfun,
        micAvail: micAvail,
        flexRank: flexRankNumber,
        soloRank: soloRankNumber,
        notes: notes
    });
}

//checks for user's inputs of the checkboxes
function grindFun() {
    if (document.getElementById('grind').checked && document.getElementById('fun').checked)
        return 2;
    else if (document.getElementById('grind').checked && !document.getElementById('fun').checked)
        return 1;
    return 0;
}

function checkMic() {
    var e = document.getElementById('micAvailability');
    var userInput = e.options[e.selectedIndex].value;

    if (userInput == 'yes')
        return true;
    return false;
}

function readData() {
    //var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('summoners').once('value').then(function(snapshot) {
        var summoners = snapshot.val();
        for (var key in summoners) {
            console.log(key, summoners[key].userIgn);
        }
    });
}

function calcTier(tier) {
    switch(tier) {
        case 'BRONZE':
            return 0;
        case 'SILVER':
            return 5;
        case 'GOLD':
            return 10;
        case 'PLATINUM':
            return 15;
        case 'DIAMOND':
            return 20;
        case 'MASTER':
            return 25;
        case 'CHALLENGER':
            return 26;
        default:
            return -1;
    }
}

function calcRank(rank) {
    switch(rank) {
        case 'V':
            return 0;
        case 'IV':
            return 1;
        case 'III':
            return 2;
        case 'II':
            return 3;
        case 'I':
            return 4;
        default: 
    }
}