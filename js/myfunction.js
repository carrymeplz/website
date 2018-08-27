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
var naSummonerRef = firebase.database().ref('na');
var euwSummonerRef = firebase.database().ref('euw');
var krSummonerRef = firebase.database().ref('kr');

//////////////////////////////////////////////////////////////////////////

//Dictionary for the tiers. For decoding purposes
var tierDict = {
    0: "Bronze",
    1: "Silver",
    2: "Gold",
    3: "Platinum",
    4: "Diamond",
    5: "Master",
    6: "Challenger",
    7: "Unranked"
};

var https = 'https://'
var summonerLink = 'api.riotgames.com/lol/summoner/v3/summoners/by-name/'
var rankLink = 'api.riotgames.com/lol/league/v3/positions/by-summoner/';
var API_KEY = '?api_key=RGAPI-aca0f11c-6483-474c-8404-0ad570bc393c'; //copy and paste your API KEY\
var region;
var fullSummonerLink;
var fullRankLink;

//Get the region of the player
function getRegion() {
    if (document.getElementById('na').checked) {
        region = document.getElementById('na').value;
    } else if (document.getElementById('euw').checked) {
        region = document.getElementById('euw').value;
    } else if (document.getElementById('kr').checked) {
        region = document.getElementById('kr').value;
    } else {
        region = "";
    }
}

// var string = document.getElementById('txt').value;
// chars = string.split(' ');
// if (chars.length > 1)
// alert('Space(s) found in the string.');
// else
// alert('No space in the string.');

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
    var summonerLevel;
    var profileIconId;
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
        soloduo: document.getElementById('soloduo').checked ? 1 : 0,
        flex: document.getElementById('flex').checked ? 1 : 0,
        norm: document.getElementById('norm').checked ? 1 : 0,
        aram: document.getElementById('aram').checked ? 1 : 0
    };
    var micAvail = checkMic();
    var notes = document.getElementById('notes').value;

    fullSummonerLink = https + region + summonerLink + userIgn.replace(/ /g, '') + API_KEY;
    console.log(fullSummonerLink);
    var isValidIgn = false;
    if (validateInput(userIgn, region, roles, gameType, grindorfun, micAvail)) {
        $.getJSON('https://json2jsonp.com/?url=' + encodeURIComponent(fullSummonerLink) + '&callback=?', function(data) {
        //$.getJSON('http://cors.io/?' + encodeURIComponent(fullSummonerLink) + '&callback=?', function(data) {
        //$.getJSON(encodeURIComponent(fullSummonerLink) + '?jsoncallback=?', {format: "json"}, function(data) {
            if (Object.keys(data).length == 1 && data['status']['status_code'] == 404) {
                console.log('Data not found');
                validate(true, '#ignWarning');
            } else {
                userId = data['id'];
                userIgn = data['name'];
                summonerLevel = data['summonerLevel'];
                profileIconId = data['profileIconId'];
                isValidIgn = true;
            }
        }).then(function() {
            if (isValidIgn) {
                fullRankLink = https + region + rankLink + userId + API_KEY;
                region = region.replace(/[1.]/g, '');
                console.log(region);
                flexRankNumber = -1;
                soloRankNumber = -1;
                var soloRankWins = -1;
                var soloRankLosses = -1;
                var flexRankWins = -1;
                var flexRankLosses = -1;
                $.getJSON('https://json2jsonp.com/?url=' + fullRankLink +'&callback=?', function(data) {
                    var objectSize = Object.keys(data).length;
                    if (objectSize == 1) {
                        if (data[0]['queueType'].localeCompare('RANKED_SOLO_5X5')) {
                            soloTier = data[0]['tier'];
                            soloRank = data[0]['rank'];
                            soloRankWins = data[0]['wins'];
                            soloRankLosses = data[0]['losses'];
                            flexRankNumber = -1;
                            soloRankNumber = calcTier(soloTier);         
                        } else if (data[0]['queueType'].localeCompare('RANKED_FLEX_SR')) {
                            flexTier = data[0]['tier'];
                            flexRank = data[0]['rank'];
                            flexRankWins = data[0]['wins'];
                            flexRankLosses = data[0]['losses'];
                            flexRankNumber = calcTier(flexTier);
                            soloRankNumber = -1;
                        }
                    } else if (objectSize == 2) {
                        flexTier = data[0]['tier'];
                        flexRank = data[0]['rank'];
                        soloTier = data[1]['tier'];
                        soloRank = data[1]['rank'];
                        flexRankWins = data[0]['wins'];
                        flexRankLosses = data[0]['losses'];
                        soloRankWins = data[1]['wins'];
                        soloRankLosses = data[1]['losses'];                   
                        flexRankNumber = calcTier(flexTier);
                        soloRankNumber = calcTier(soloTier);
                    }                    
                    if (flexRankNumber < 25 && flexRankNumber >= 0)
                        flexRankNumber += calcRank(flexRank);
                    if (soloRankNumber < 25 && soloRankNumber >= 0)
                        soloRankNumber += calcRank(soloRank);
                    saveSummoner(region, userId, userIgn, roles, gameType, grindorfun, micAvail, 
                        flexRankNumber, soloRankNumber, summonerLevel, profileIconId, notes, 
                        flexRankWins, flexRankLosses, soloRankWins, soloRankLosses);
                    //window.location.href = "./list.html?region=" + region;
                    window.location.href = "./list.html?region=" + region + '&soloRankNumber=' + soloRankNumber 
                        + '&flexRankNumber=' + flexRankNumber + '&gameType=' + gameType['aram'] + gameType['flex'] 
                        + gameType['norm'] + gameType['soloduo'] + '&grindorfun=' + grindorfun + '&micavailability=' + micAvail;
                }).fail(function(data) {
                    console.log('Failed');
                    saveSummoner(region, userId, userIgn, roles, gameType, grindorfun, micAvail, 
                        flexRankNumber, soloRankNumber, summonerLevel, profileIconId, notes, 
                        flexRankWins, flexRankLosses, soloRankWins, soloRankLosses);
                    window.location.href = "./list.html?region=" + region + '&soloRankNumber=' + soloRankNumber 
                        + '&flexRankNumber=' + flexRankNumber + '&gameType=' + gameType['aram'] + gameType['flex'] 
                        + gameType['norm'] + gameType['soloduo'] + '&grindorfun=' + grindorfun + '&micavailability=' + micAvail;
                });
            }
        })
    }

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
function saveSummoner(region, userId, ign, roles, gameType, grindorfun, micAvail, 
    flexRankNumber, soloRankNumber, summonerLevel, profileIconId, notes, 
    flexRankWins, flexRankLosses, soloRankWins, soloRankLosses) {
    var summonerRef = checkRegion(region);
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
        summonerLevel: summonerLevel,
        profileIconId: profileIconId,
        notes: notes,
        flexRankWins: flexRankWins,
        flexRankLosses: flexRankLosses,
        soloRankWins: soloRankWins,
        soloRankLosses: soloRankLosses
    });
}

//Checking for user's region to decide which firebase table the user will be stored in
function checkRegion(region) {
    switch(region) {
        case 'na':
            return naSummonerRef;
        case 'euw':
            return euwSummonerRef;
        case 'kr':
            return krSummonerRef;
        default:
            return '';
    }
}

//User's input validation. Checks for any inputs that is not filled out
function validateInput(userIgn, region, roles, gameType, grindorfun, micAvail) {
    var success = true;
    
    if (!validate(region.length == 0, '#serverWarning')) {
        success = false;
    }
    if (!validate(userIgn.length == 0, '#ignWarning')) {
        success = false;
    }

    var checked = 0;
    for (var role in roles) {
        if (roles[role]) {
            checked++;
        }
    }

    if (!validate(checked == 0, '#rolesWarning')) {
        success = false;
    }

    checked = 0;
    for (var type in gameType) {
        if (gameType[type]) {
            checked++;
        }
    }

    if (!validate(checked == 0, '#gameTypeWarning')) {
        success = false;
    }
    if (!validate(grindorfun == -1, '#grindOrFunWarning')) {
        success = false;
    }
    if (!validate(micAvail == -1, '#micAvailWarning')) {
        success = false;
    }

    return success;
}

//Shows and hides the error message for validation
function validate(condition, id) {
    if (condition) {
        // fail case
        $(id).css('display', 'block');
        return false;
    } else {
        // success case
        $(id).css('display', 'none');
    }
    return true;
}

//checks for user's inputs of the checkboxes
function grindFun() {
    if (document.getElementById('grind').checked && document.getElementById('fun').checked)
        return 2;
    else if (document.getElementById('grind').checked)
        return 1;
    else if (document.getElementById('fun').checked)
        return 0;
    return -1;
}

//checks for user's input of mic availability
function checkMic() {
    var e = document.getElementById('micAvailability');
    var userInput = e.options[e.selectedIndex].value;
    if (userInput == 'yes')
        return 1;
    else if (userInput == 'no')
        return 0;
    return -1;
}

//Reading data from firebase and console logs.
//Hard coded for retrieving 'na' region data
//I think this method is just for test purposes to check how to retrieve data?
function readData(userRegion) {
    //var userId = firebase.auth().currentUser.uid;
    window.location.href = "./list.html?region=" + userRegion;

    return firebase.database().ref(userRegion).once('value').then(function(snapshot) {
        var summoners = snapshot.val();
        for (var key in summoners) {
            console.log(key, summoners[key].userIgn);
            console.log(key, summoners[key].profileIconId);
            console.log(key, tierDict[decodeTier(summoners[key].soloRank)]);
            console.log(key, decodeRank(summoners[key].soloRank));
            console.log(key, tierDict[decodeTier(summoners[key].flexRank)]);
            console.log(key, decodeRank(summoners[key].flexRank));
            console.log(key, summoners[key].flexRankWins);
            console.log(key, summoners[key].flexRankLosses);
            console.log(key, Math.round(summoners[key].flexRankWins / (summoners[key].flexRankWins + summoners[key].flexRankLosses) * 100));
            console.log(key, summoners[key].soloRankWins);
            console.log(key, summoners[key].soloRankLosses);
            console.log(key, Math.round(summoners[key].soloRankWins / (summoners[key].soloRankWins + summoners[key].soloRankLosses) * 100));
            appendChecked(summoners[key].roles);
            appendChecked(summoners[key].gameType);
            if (summoners[key].grindorfun == 2)
                console.log('grind/fun');
            else if (summoners[key].grindorfun == 1)
                console.log('grind');
            else
                console.log('fun');
            if (summoners[key].micAvail == 1)
                console.log('yes');
            else
                console.log('no');
            console.log(key, summoners[key].notes);
        }
    });
}

//decodes the tier when grabbing from the database
function decodeTier(tier) {
    if (tier == -1)
        return 7;
    else if (tier == 26)
        return 6;
    else if (tier == 25)
        return 5;
    else
        return Math.floor(tier / 5);
}

//decodes the rank when grabbing from the database
function decodeRank(rank) {
    if (rank == -1)
        return ;
    else if (rank == 26)
        return 1;
    else if (rank == 25)
        return 1;
    else
        return 5 - rank % 5;
}

//calculates user's tier and assigns a number to be added with the rank number
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

//calculates user's rank to be added with the tier number for firebase
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
            return -1;
    }
}