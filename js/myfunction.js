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
//Functions for stepper

var indexNumber = 1;

$("div.next-btn").click(function() {
    if (indexNumber == 1) {
        $("#first-form").css('display', 'none');
        $("#second-form").css('display', 'block');
        $("#submit-btn").css('display', 'none');
        $(".next-btn").css('display', 'block');
        $(".prev-btn").css('display', 'block');
    } else if (indexNumber == 2) {
        $("#second-form").css('display', 'none');
        $("#third-form").css('display', 'block');
        $("#submit-btn").css('display', 'block');
        $(".next-btn").css('display', 'none');
        $(".prev-btn").css('display', 'block');
    } else {
        alert("success");
    }
    indexNumber++;
});

$("div.prev-btn").click(function() {
    if (indexNumber == 2) {
        $("#first-form").css('display', 'block');
        $("#second-form").css('display', 'none');
        $("#submit-btn").css('display', 'none');
        $(".next-btn").css('display', 'block');
        $(".prev-btn").css('display', 'none');
    } else if (indexNumber == 3) {
        $("#second-form").css('display', 'block');
        $("#third-form").css('display', 'none');
        $("#submit-btn").css('display', 'none');
        $(".next-btn").css('display', 'block');
    } else {
        alert("success");
    }
    indexNumber--;
});

//////////////////////////////////////////////////////////////////////////
//runs as soon as the website starts
$(document).ready(function() {
    $( "input[type='radio']" ).css( "display", "none" );
    $(".region_btn div").css('line-height', '' + $(".region_btn div").width() + 'px');
});

//////////////////////////////////////////////////////////////////////////
//called whenever there is a resize because of the region button size

$(window).on('resize', function() {
    $(".region_btn div").css('line-height', '' + $(".region_btn div").width() + 'px');
});

/////////////////////////////////////////////////////////////////////////

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
var API_KEY = '?api_key=RGAPI-baad6c8a-c614-475d-9846-07f3c80e49b7'; //copy and paste your API KEY\
var region;
var fullSummonerLink;
var fullRankLink;
var micAvail;
var numRoles = 0;
var roleFirstPick;
var roleSecondPick;
var regionRowNumber = 0;
var regionDivNumber = 0;

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

function submittedTest() {
    window.location.href = 'file:///C:/Users/Ryan/Desktop/website/ject/list.html?region=na&soloRankNumber=10&flexRankNumber=8&gameType=0100&grindorfun=1&micavailability=0';        
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

// changes the background color of the roles buttons when clicked
// role is a string passed from index.html (ex.fill, top, mid)
// haha understand this method at your own will
function rolesButtonClicked(role) {
    if (document.getElementById(role).checked) {
        $('#' + role + 'Icon').css('background-color', '#000000');
        if (numRoles == 0 && role == 'fill') {
            roleFirstPick = 'fill';
            numRoles = 5;
        } else if (numRoles == 0) {
            roleFirstPick = role;
            numRoles++;
        } else if (numRoles == 1 && role == 'fill') {
            $('#' + roleFirstPick + 'Icon').css('background-color', '#606060');
            $('#' + roleFirstPick).prop("checked", false);
            roleFirstPick = role;
            numRoles = 5;
        } else if (numRoles == 2 && role == 'fill') {
            $('#' + roleFirstPick + 'Icon').css('background-color', '#606060');
            $('#' + roleFirstPick).prop("checked", false);
            $('#' + roleSecondPick + 'Icon').css('background-color', '#606060');
            $('#' + roleSecondPick).prop("checked", false);
            roleFirstPick = role;
            roleSecondPick = '';
            numRoles = 5;
        } else if (numRoles == 1) {
            roleSecondPick = role;
            numRoles++;
        } else if (numRoles == 2) {
            $('#' + roleFirstPick + 'Icon').css('background-color', '#606060');
            $('#' + roleFirstPick).prop("checked", false);
            roleFirstPick = roleSecondPick;
            roleSecondPick = role;
        } else if (numRoles == 5) {
            $('#' + roleFirstPick + 'Icon').css('background-color', '#606060');
            $('#' + roleFirstPick).prop("checked", false);
            roleFirstPick = role;
            numRoles = 1;
        }
    } else {
        if (numRoles == 1) {
            roleFirstPick = '';
            numRoles--;
        } else if (numRoles == 2) {
            if (roleFirstPick == role) {
                roleFirstPick = roleSecondPick;
                roleSecondPick = '';
                numRoles--;
            } else if (roleSecondPick == role) {
                roleSecondPick = '';
                numRoles--;
            }
        } else if (numRoles == 5) {
            roleFirstPick = '';
            numRoles = 0;
        } 
        $('#' + role + 'Icon').css('background-color', '#606060');
    }
    
    // if (!this.checked) {
    //     $('.role_icons').on('click', function() {
    //         $(this).css('background-color', '#000000');
    //     });
    // } else {
    //     $('.role_icons').on('click', function() {
    //         $(this).css('background-color', '#606060');
    //     });
    // }

    // if (!(this.checked)) {
    //     $('.role_icons').click(function(e){
    //         $(e.currentTarget).css('background-color', '#000000');
    //     });
    // } else {
    //     $('.role_icons').click(function(e){
    //         $(e.currentTarget).css('background-color', '#606060');
    //     });
    // }
    
}

function regionButtonClicked(region) {
    switch(region) {
        case 'na':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 1;
            regionDivNumber = 1;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'euw':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 1;
            regionDivNumber = 2;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'eune':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 1;
            regionDivNumber = 3;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'kr':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 1;
            regionDivNumber = 4;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'ru':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 2;
            regionDivNumber = 1;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'br':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 2;
            regionDivNumber = 2;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'oce':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 2;
            regionDivNumber = 3;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'jp':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 2;
            regionDivNumber = 4;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'tr':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 3;
            regionDivNumber = 1;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'la1':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 3;
            regionDivNumber = 2;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
        case 'la2':
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#0082c8');
            regionRowNumber = 3;
            regionDivNumber = 3;
            $(".region_rows:nth-of-type(" + regionRowNumber + ") .region_btn:nth-of-type(" + regionDivNumber + ")").css('background-color', '#002448');
            break;
    }

}

function gofButtonClicked(playstyle) {
    if (playstyle == 'grind' && document.getElementById('grind').checked) {
        $(".gof_btn:nth-of-type(1)").css('background-color', '#EE6F59');
        $(".gof_btn:nth-of-type(1)").css('color', 'white');
    } else if (playstyle == 'grind' && !document.getElementById('grind').checked) {
        $(".gof_btn:nth-of-type(1)").css('background-color', 'white');
        $(".gof_btn:nth-of-type(1)").css('color', 'black');
    } else if (playstyle == 'fun' && document.getElementById('fun').checked) {
        $(".gof_btn:nth-of-type(2)").css('background-color', '#EE6F59');
        $(".gof_btn:nth-of-type(2)").css('color', 'white');
    } else if (playstyle == 'fun' && !document.getElementById('fun').checked) {
        $(".gof_btn:nth-of-type(2)").css('background-color', 'white');
        $(".gof_btn:nth-of-type(2)").css('color', 'black');
    }
}

function gametypeButtonClicked(gametype) {
    if (gametype == 'soloduo' && document.getElementById('soloduo').checked) {
        $(".gametype_btn:nth-of-type(1)").css('background-color', '#EE6F59');
        $(".gametype_btn:nth-of-type(1)").css('color', 'white');
        // $(".gametype_btn:nth-of-type(4)").css('background-color', 'white');
        // $(".gametype_btn:nth-of-type(4)").css('color', 'black');
    } else if (gametype == 'soloduo' && !document.getElementById('soloduo').checked) {
        $(".gametype_btn:nth-of-type(1)").css('background-color', 'white');
        $(".gametype_btn:nth-of-type(1)").css('color', 'black');
    } else if (gametype == 'flex' && document.getElementById('flex').checked) {
        $(".gametype_btn:nth-of-type(2)").css('background-color', '#EE6F59');
        $(".gametype_btn:nth-of-type(2)").css('color', 'white');
        // $(".gametype_btn:nth-of-type(4)").css('background-color', 'white');
        // $(".gametype_btn:nth-of-type(4)").css('color', 'black');
    } else if (gametype == 'flex' && !document.getElementById('flex').checked) {
        $(".gametype_btn:nth-of-type(2)").css('background-color', 'white');
        $(".gametype_btn:nth-of-type(2)").css('color', 'black');
    } else if (gametype == 'norm' && document.getElementById('norm').checked) {
        $(".gametype_btn:nth-of-type(3)").css('background-color', '#EE6F59');
        $(".gametype_btn:nth-of-type(3)").css('color', 'white');
        // $(".gametype_btn:nth-of-type(4)").css('background-color', 'white');
        // $(".gametype_btn:nth-of-type(4)").css('color', 'black');
    } else if (gametype == 'norm' && !document.getElementById('norm').checked) {
        $(".gametype_btn:nth-of-type(3)").css('background-color', 'white');
        $(".gametype_btn:nth-of-type(3)").css('color', 'black');
    } else if (gametype == 'aram' && document.getElementById('aram').checked) {
        $(".gametype_btn:nth-of-type(4)").css('background-color', '#EE6F59');
        $(".gametype_btn:nth-of-type(4)").css('color', 'white');
        // $(".gametype_btn:nth-of-type(1)").css('background-color', 'white');
        // $(".gametype_btn:nth-of-type(1)").css('color', 'black');
        // $(".gametype_btn:nth-of-type(2)").css('background-color', 'white');
        // $(".gametype_btn:nth-of-type(2)").css('color', 'black');
        // $(".gametype_btn:nth-of-type(3)").css('background-color', 'white');
        // $(".gametype_btn:nth-of-type(3)").css('color', 'black');
    } else if (gametype == 'aram' && !document.getElementById('aram').checked) {
        $(".gametype_btn:nth-of-type(4)").css('background-color', 'white');
        $(".gametype_btn:nth-of-type(4)").css('color', 'black');
    }
}

function micButtonClicked(answer) {
    if (answer == 'mic') {
        $(micIcon).css('background-color', '#000000');
        $(noMicIcon).css('background-color', '#606060');
        micAvail = 1;
    } else if (answer == 'noMic') {
        $(micIcon).css('background-color', '#606060');
        $(noMicIcon).css('background-color', '#000000');
        micAvail = 0;
    }
}