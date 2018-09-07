// permanent lists
var soloDuoList = [];
var flexList = [];
var normList = [];
var aramList = [];

// filtered lists
var soloDuoListF = [];
var flexListF = [];
var normListF = [];
var aramListF = [];

// filter variables
var rankPlusTwo = true;
var rankPlusOne = true;
var rankSame = true;
var rankMinusOne = true;
var rankMinusTwo = true;
var roleTop = true;
var roleJg = true;
var roleMid = true;
var roleAdc = true;
var roleSupp = true;

var region;
var flexR;
var soloR;
var gameType;
var soloduo;
var flex;
var norm;
var aram;
var grindOrFun;
var grind = true;
var fun = true;
var mic = true;
var noMic = true;
var micAvail;

$(document).ready(function() {

    var queryString = decodeURIComponent(window.location.search);
    queryString = queryString.substring(1);
    var queries = queryString.split("&");

    region = queries[0].split('=')[1];
    soloR = queries[1].split('=')[1];
    flexR = queries[2].split('=')[1];
	gameType = queries[3].split('=')[1];
    aram = Math.floor(gameType / 1000);
    flex = Math.floor(gameType / 100) % 10;
    norm = Math.floor(gameType / 10) % 10;
	soloduo = gameType % 10;
    grindOrFun = queries[4].split('=')[1];
    micAvail = queries[5].split('=')[1];

	if (!soloduo)
		$('#soloduoFilter').css('background-color', 'grey');
	
	if (!flex)
		$('#flexFilter').css('background-color', 'grey');
	
	if (!norm)
		$('#normalFilter').css('background-color', 'grey');

	if (!aram)
		$('#aramFilter').css('background-color', 'grey');

	if (grindOrFun == 0) {
		grind = false;
		fun = true;
		$('#grindFilter').css('background-color', 'grey');
	}
		
	if (grindOrFun == 1) {
		grind = true;
		fun = false;
		$('#funFilter').css('background-color', 'grey');
	}

    firebase.database().ref(region).once('value').then(function(snapshot) {
        var summoners = snapshot.val();
        for (var key in summoners) {
        	sortGameType(summoners[key]);
        }
        appendList(soloDuoList, flexList, normList, aramList);
    });
})

function filterTier(tierFilter) {
	switch (tierFilter) {
		case 2:
			rankPlusTwo = !rankPlusTwo;
			if (rankPlusTwo)
				$('#2TierAbove').css('background-color', 'cyan');
			else
				$('#2TierAbove').css('background-color', 'grey');
			break;
		case 1:
			rankPlusOne = !rankPlusOne;
			if (rankPlusOne)
				$('#1TierAbove').css('background-color', 'cyan');
			else
				$('#1TierAbove').css('background-color', 'grey');
			break;
		case 0:
			rankSame = !rankSame;
			if (rankSame)
				$('#0TierAbove').css('background-color', 'cyan');
			else
				$('#0TierAbove').css('background-color', 'grey');
			break;
		case -1:
			rankMinusOne = !rankMinusOne;
			if (rankMinusOne)
				$('#1TierBelow').css('background-color', 'cyan');
			else
				$('#1TierBelow').css('background-color', 'grey');
			break;
		case -2:
			rankMinusTwo = !rankMinusTwo;
			if (rankMinusTwo)
				$('#2TierBelow').css('background-color', 'cyan');
			else
				$('#2TierBelow').css('background-color', 'grey');
			break;
		default:
			break;
	}
}

function filterRole(roleFilter) {
	switch (roleFilter) {
		case 'top':
			roleTop = !roleTop;
			if (roleTop)
				$('#topFilter').css('background-color', 'cyan');
			else
				$('#topFilter').css('background-color', 'grey');
			break;
		case 'jg':
			roleJg = !roleJg;
			if (roleJg)
				$('#jgFilter').css('background-color', 'cyan');
			else
				$('#jgFilter').css('background-color', 'grey');
			break;
		case 'mid':
			roleMid = !roleMid;
			if (roleMid)
				$('#midFilter').css('background-color', 'cyan');
			else
				$('#midFilter').css('background-color', 'grey');
			break;
		case 'adc':
			roleAdc = !roleAdc;
			if (roleAdc)
				$('#adcFilter').css('background-color', 'cyan');
			else
				$('#adcFilter').css('background-color', 'grey');
			break;
		case 'supp':
			roleSupp = !roleSupp;
			if (roleSupp)
				$('#suppFilter').css('background-color', 'cyan');
			else
				$('#suppFilter').css('background-color', 'grey');
			break;
		default:
			break;
	}
}

function filterGameType(gameTypeFilter) {
	switch (gameTypeFilter) {
		case 'soloduo':
			soloduo = !soloduo;
			if (soloduo)
				$('#soloduoFilter').css('background-color', 'cyan');
			else 
				$('#soloduoFilter').css('background-color', 'grey');
			break;
		case 'flex':
			flex = !flex;
			if (flex)
				$('#flexFilter').css('background-color', 'cyan');
			else 
				$('#flexFilter').css('background-color', 'grey');
			break;
		case 'normal':
			norm = !norm;
			if (norm)
				$('#normalFilter').css('background-color', 'cyan');
			else 
				$('#normalFilter').css('background-color', 'grey');
			break;
		case 'aram':
			aram = !aram;
			if (aram)
				$('#aramFilter').css('background-color', 'cyan');
			else 
				$('#aramFilter').css('background-color', 'grey');
			break;
		default:
			break;
	}
}

function filterGrindOrFun(filter) {
	switch (filter) {
		case 'grind':
			grind = !grind;
			if (grind)
				$('#grindFilter').css('background-color', 'cyan');
			else 
				$('#grindFilter').css('background-color', 'grey');
			break;
		case 'fun':
			fun = !fun;
			if (fun)
				$('#funFilter').css('background-color', 'cyan');
			else 
				$('#funFilter').css('background-color', 'grey');
			break;
		default:
			break;
	}
}

function filterMic(filter) {
	switch (filter) {
		case 'yes':
			mic = !mic;
			if (mic)
				$('#micFilter').css('background-color', 'cyan');
			else
				$('#micFilter').css('background-color', 'grey');
			break;
		case 'no':
			noMic = !noMic;
			if (noMic)
				$('#noMicFilter').css('background-color', 'cyan');
			else
				$('#noMicFilter').css('background-color', 'grey');
			break;
		default:
			break;
	}
}

function rankFilter() {
	soloDuoListF = [];
	for (var player in soloDuoList) {
		if (rankPlusTwo && parseInt(soloR) + 2 == soloDuoList[player].soloRank)
			soloDuoListF.push(soloDuoList[player]);
		if (rankPlusOne && parseInt(soloR) + 1 == soloDuoList[player].soloRank)
			soloDuoListF.push(soloDuoList[player]);
		if (rankSame && soloR == soloDuoList[player].soloRank)
			soloDuoListF.push(soloDuoList[player]);
		if (rankMinusOne && soloR - 1 == soloDuoList[player].soloRank)
			soloDuoListF.push(soloDuoList[player]);
		if (rankMinusTwo && soloR - 2 == soloDuoList[player].soloRank)
			soloDuoListF.push(soloDuoList[player]);
	}

	flexListF = [];
	for (var player in flexList) {
		if (rankPlusTwo && parseInt(flexR) + 2 == flexList[player].flexRank)
			flexListF.push(flexList[player]);
		if (rankPlusOne && parseInt(flexR) + 1 == flexList[player].flexRank)
			flexListF.push(flexList[player]);
		if (rankSame && flexR == flexList[player].flexRank)
			flexListF.push(flexList[player]);
		if (rankMinusOne && flexR - 1 == flexList[player].flexRank)
			flexListF.push(flexList[player]);
		if (rankMinusTwo && flexR - 2 == flexList[player].flexRank)
			flexListF.push(flexList[player]);
	}
}

// filter out based on roles
// top bot supp
// temp list to copy the filtered list
// clear the filtered list
// use the temp list to find match
//     if top add to filtered list
//     if bot add to filtered list
//     if supp add to filtered list
function roleFilter() {
	var tempSoloDuoListF = Array.from(soloDuoListF);
	var tempFlexListF = Array.from(flexListF);
	
	soloDuoListF = [];
	flexListF = [];
	normListF = [];

	var matched = false;
	for (var player in tempSoloDuoListF) {
		if (roleTop && tempSoloDuoListF[player].roles['top']) {
			soloDuoListF.push(tempSoloDuoListF[player]);
			matched = true;
		}
		if (!matched && roleJg && tempSoloDuoListF[player].roles['jg']) {
			soloDuoListF.push(tempSoloDuoListF[player]);
			matched = true;
		}
		if (!matched && roleMid && tempSoloDuoListF[player].roles['mid']) {
			soloDuoListF.push(tempSoloDuoListF[player]);
			matched = true;
		}
		if (!matched && roleAdc && tempSoloDuoListF[player].roles['adc']) {
			soloDuoListF.push(tempSoloDuoListF[player]);
			matched = true;
		}
		if (!matched && roleSupp && tempSoloDuoListF[player].roles['supp']) {
			soloDuoListF.push(tempSoloDuoListF[player]);
		}
		matched = false;
	}

	
	for (var player in tempFlexListF) {
		matched = false;

		if (roleTop && tempFlexListF[player].roles['top']) {
			flexListF.push(tempFlexListF[player]);
			matched = true;
		}
		if (!matched && roleJg && tempFlexListF[player].roles['jg']) {
			flexListF.push(tempFlexListF[player]);
			matched = true;
		}
		if (!matched && roleMid && tempFlexListF[player].roles['mid']) {
			flexListF.push(tempFlexListF[player]);
			matched = true;
		}
		if (!matched && roleAdc && tempFlexListF[player].roles['adc']) {
			flexListF.push(tempFlexListF[player]);
			matched = true;
		}
		if (!matched && roleSupp && tempFlexListF[player].roles['supp']) {
			flexListF.push(tempFlexListF[player]);
		}
	}

	
	for (var player in normList) {
		matched = false;

		if (roleTop && normList[player].roles['top']) {
			normListF.push(normList[player]);
			matched = true;
		}
		if (!matched && roleJg && normList[player].roles['jg']) {
			normListF.push(normList[player]);
			matched = true;
		}
		if (!matched && roleMid && normList[player].roles['mid']) {
			normListF.push(normList[player]);
			matched = true;
		}
		if (!matched && roleAdc && normList[player].roles['adc']) {
			normListF.push(normList[player]);
			matched = true;
		}
		if (!matched && roleSupp && normList[player].roles['supp']) {
			normListF.push(normList[player]);
		}
	}
}

function grindOrFunFilter() {
	var tempSoloDuoListF = Array.from(soloDuoListF);
	var tempFlexListF = Array.from(flexListF);
	var tempNormalListF = Array.from(normListF);

	soloDuoListF = [];
	flexListF = [];
	normListF = [];
	aramListF = [];

	var matched = false;
	for (var player in tempSoloDuoListF) {
		var gof = tempSoloDuoListF[player]['grindorfun'];

		if (grind && !fun && (gof == 1 || gof == 2)) {
			soloDuoListF.push(tempSoloDuoListF[player]);
			matched = true;
		}
		if (!matched && !grind && fun && (gof == 0 || gof == 2)) {
			soloDuoListF.push(tempSoloDuoListF[player]);
		}
		matched = false;
	}
	
	for (var player in tempFlexListF) {
		matched = false;
		var gof = tempFlexListF[player]['grindorfun'];

		if (grind && !fun && (gof == 1 || gof == 2)) {
			flexListF.push(tempFlexListF[player]);
			matched = true;
		}
		if (!matched && !grind && fun && (gof == 0 || gof == 2)) {
			flexListF.push(tempFlexListF[player]);
		}
	}
	
	for (var player in tempNormalListF) {
		matched = false;
		var gof = tempNormalListF[player]['grindorfun'];

		if (grind && !fun && (gof == 1 || gof == 2)) {
			normListF.push(tempNormalListF[player]);
			matched = true;
		}
		if (!matched && !grind && fun && (gof == 0 || gof == 2)) {
			normListF.push(tempNormalListF[player]);
		}
	}
	
	for (var player in aramList) {
		matched = false;
		var gof = aramList[player]['grindorfun'];

		if (grind && !fun && (gof == 1 || gof == 2)) {
			aramListF.push(aramList[player]);
			matched = true;
		}
		if (!matched && !grind && fun && (gof == 0 || gof == 2)) {
			aramListF.push(aramList[player]);
		}
	}
}

function applyMicFilter() {
	var tempSoloDuoListF = Array.from(soloDuoListF);
	var tempFlexListF = Array.from(flexListF);
	var tempNormalListF = Array.from(normListF);
	var tempAramListF = Array.from(aramListF);

	soloDuoListF = [];
	flexListF = [];
	normListF = [];
	aramListF = [];

	var matched = false;
	for (var player in tempSoloDuoListF) {
		var micAvailability = tempSoloDuoListF[player]['micAvail'];

		if (mic && !noMic && micAvailability == 1) {
			soloDuoListF.push(tempSoloDuoListF[player]);
			matched = true;
		}
		if (!mic && noMic && micAvailability == 0) {
			soloDuoListF.push(tempSoloDuoListF[player]);
		}
		matched = false;
	}

	for (var player in tempFlexListF) {
		matched = false;
		var micAvailability = tempFlexListF[player]['micAvail'];

		if (mic && !noMic && micAvailability == 1) {
			flexListF.push(tempFlexListF[player]);
			matched = true;
		}
		if (!mic && noMic && micAvailability == 0) {
			flexListF.push(tempFlexListF[player]);
		}
	}

	for (var player in tempNormalListF) {
		matched = false;
		var micAvailability = tempNormalListF[player]['micAvail'];

		if (mic && !noMic && micAvailability == 1) {
			normListF.push(tempNormalListF[player]);
			matched = true;
		}
		if (!mic && noMic && micAvailability == 0) {
			normListF.push(tempNormalListF[player]);
		}
	}

	for (var player in tempAramListF) {
		matched = false;
		var micAvailability = tempAramListF[player]['micAvail'];

		if (mic && !noMic && micAvailability == 1) {
			aramListF.push(tempAramListF[player]);
			matched = true;
		}
		if (!mic && noMic && micAvailability == 0) {
			aramListF.push(tempAramListF[player]);
		}
	}
}

// Apply selected filter
function applyFilter() {
	rankFilter(); 
	roleFilter();
	if (!grind || !fun) {
		grindOrFunFilter();
	} else {
		//lol jokes
	}
	if (!mic || !noMic) {
		applyMicFilter();
	} else {
		//jokes again lol
	}
	
	appendList(soloDuoListF, flexListF, normListF, aramListF);
}

function appendList(list1, list2, list3, list4) {
	$('#soloduoSummonersList tbody').empty();
	if (soloduo) {
		appendListHelper(list1, '#soloduoSummonersList');
	}

	$('#flexSummonersList tbody').empty();
	if (flex) {
		appendListHelper(list2, '#flexSummonersList');
	}

	$('#normSummonersList tbody').empty();
	if (norm) {
		appendListHelper(list3, '#normSummonersList');
	}

	$('#aramSummonersList tbody').empty();
	if (aram) {
		appendListHelper(list4, '#aramSummonersList');
	}
}

function appendListHelper(list, id) {
	for (var player in list) {
    	var row = "<tr>";
        row = row.concat("<td>" + list[player].userIgn + "</td>");
        row = row.concat("<td><img src='http://ddragon.leagueoflegends.com/cdn/8.16.1/img/profileicon/" + list[player].profileIconId + ".png'/></td>");
        row = row.concat("<td><img src='./pictures/tier/" + tierDict[decodeTier(list[player].soloRank)] + ".png'/></td>");
        row = row.concat("<td>" + tierDict[decodeTier(list[player].soloRank)] + "</td>");
        row = row.concat("<td>" + decodeRank(list[player].soloRank) + "</td>");
        row = row.concat("<td><img src='./pictures/tier/" + tierDict[decodeTier(list[player].flexRank)] + ".png'/></td>");
        row = row.concat("<td>" + tierDict[decodeTier(list[player].flexRank)] + "</td>");
        row = row.concat("<td>" + decodeRank(list[player].flexRank) + "</td>");
        row = row.concat("<td>" + list[player].flexRankWins + "</td>");
        row = row.concat("<td>" + list[player].flexRankLosses + "</td>");
        row = row.concat("<td>" + Math.round(list[player].flexRankWins / (list[player].flexRankWins + list[player].flexRankLosses) * 100) + "</td>");
        row = row.concat("<td>" + list[player].soloRankWins + "</td>");
        row = row.concat("<td>" + list[player].soloRankLosses + "</td>");
        row = row.concat("<td>" + Math.round(list[player].soloRankWins / (list[player].soloRankWins + list[player].soloRankLosses) * 100) + "</td>");
        row = row.concat(appendChecked(list[player].roles));
        row = row.concat(appendChecked(list[player].gameType));
        if (list[player].grindorfun == 2)
            row = row.concat("<td>grind/fun</td>");
        else if (list[player].grindorfun == 1)
            row = row.concat("<td>grind</td>");
        else
            row = row.concat("<td>fun</td>");
        if (list[player].micAvail == 1)
            row = row.concat("<td>yes</td>");
        else
            row = row.concat("<td>no</td>");
        row = row.concat("<td>" + list[player].notes + "</td>");
		    row = row.concat("</tr>");
        $(id).find('tbody').append(row);
	}
}

function appendChecked(datas) {
    var row = "<td>";
    for (var data in datas) {
        if (datas[data])
            row = row.concat(data + "\n");
    }
    row = row.concat("</td>");
    return row;
}

// Sort list of summoner into 4 lists of each game type
// This is done at the beginning to make the list but only some lists are shown
// depending on the user's choice. (makes it efficient for us as we dont need to 
// enter the database everytime when the user changes filters)
function sortGameType(summoner) {
	if (summoner.gameType.soloduo) {
    	if (summoner.soloRank >= soloR - 2 && summoner.soloRank <= parseInt(soloR) + 2)
    		soloDuoList.push(summoner);
	}

	if (summoner.gameType.flex) {
    	if (summoner.flexRank >= flexR - 2 && summoner.flexRank <= parseInt(flexR) + 2)
    		flexList.push(summoner);
	}

	if (summoner.gameType.norm) {
		normList.push(summoner);
	}

	if (summoner.gameType.aram) {
		aramList.push(summoner);
	}
}