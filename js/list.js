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
var fill = true;
var roleTop = true;
var roleJg = true;
var roleMid = true;
var roleAdc = true;
var roleSupp = true;
var fill2 = false;
var roleTop2 = false;
var roleJg2 = true;
var roleMid2 = true;
var roleAdc2 = true;
var roleSupp2 = true;

var region;
var userIgn;
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
var grind2 = true;
var fun2 = true;
var mic = true;
var noMic = true;
var mic2 = true;
var noMic2 = true;
var micAvail;
var expanded = false;
var expanded2 = false;
var micFilter = 0;
var micFilter2 = 0;
var posted = false;

$(document).ready(function () {

	var queryString = decodeURIComponent(window.location.search);
	queryString = queryString.substring(1);
	var queries = queryString.split("&");

	region = queries[0].split('=')[1];
	userIgn = queries[1].split('=')[1];
	soloR = queries[2].split('=')[1];
	flexR = queries[3].split('=')[1];
	gameType = queries[4].split('=')[1];
	aram = Math.floor(gameType / 1000);
	flex = Math.floor(gameType / 100) % 10;
	norm = Math.floor(gameType / 10) % 10;
	soloduo = gameType % 10;
	grindOrFun = queries[5].split('=')[1];
	micAvail = queries[6].split('=')[1];

	if (soloduo)
		$('.gametype_btn:nth-of-type(1)').css('background-color', '#EE6F59');
	else
		$('.gametype_btn:nth-of-type(1)').css('background-color', '#343a40');

	if (flex)
		$('.gametype_btn:nth-of-type(2)').css('background-color', '#EE6F59');
	else
		$('.gametype_btn:nth-of-type(2)').css('background-color', '#343a40');

	if (norm)
		$('.gametype_btn:nth-of-type(3)').css('background-color', '#EE6F59');
	else
		$('.gametype_btn:nth-of-type(3)').css('background-color', '#343a40');

	if (aram)
		$('.gametype_btn:nth-of-type(4)').css('background-color', '#EE6F59');
	else
		$('.gametype_btn:nth-of-type(4)').css('background-color', '#343a40');

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

	firebase.database().ref(region).once('value').then(function (snapshot) {
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
				$('.tiertype_btn:nth-of-type(1)').css('background-color', '#EE6F59');
			else
				$('.tiertype_btn:nth-of-type(1)').css('background-color', '#343a40');
			break;
		case 1:
			rankPlusOne = !rankPlusOne;
			if (rankPlusOne)
				$('.tiertype_btn:nth-of-type(2)').css('background-color', '#EE6F59');
			else
				$('.tiertype_btn:nth-of-type(2)').css('background-color', '#343a40');
			break;
		case 0:
			rankSame = !rankSame;
			if (rankSame)
				$('.tiertype_btn:nth-of-type(3)').css('background-color', '#EE6F59');
			else
				$('.tiertype_btn:nth-of-type(3)').css('background-color', '#343a40');
			break;
		case -1:
			rankMinusOne = !rankMinusOne;
			if (rankMinusOne)
				$('.tiertype_btn:nth-of-type(4)').css('background-color', '#EE6F59');
			else
				$('.tiertype_btn:nth-of-type(4)').css('background-color', '#343a40');
			break;
		case -2:
			rankMinusTwo = !rankMinusTwo;
			if (rankMinusTwo)
				$('.tiertype_btn:nth-of-type(5)').css('background-color', '#EE6F59');
			else
				$('.tiertype_btn:nth-of-type(5)').css('background-color', '#343a40');
			break;
		default:
			break;
	}
}

function filterRole(roleFilter, callFrom) {
	switch (roleFilter) {
		case 'fill':
			fill = !fill;
			if (callFrom == 1) {
				if (fill)
					$('#fillFilter').css('background-color', '#EE6F59');
				else
					$('#fillFilter').css('background-color', '#606060');
				break;
			} else if (callFrom == 0) {
				if (fill2)
					$('#fillEditer').css('background-color', '#EE6F59');
				else
					$('#fillEditer').css('background-color', '#606060');
				break;
			}
		case 'top':
			roleTop = !roleTop;
			if (callFrom == 1) {
				if (roleTop)
					$('#topFilter').css('background-color', '#EE6F59');
				else
					$('#topFilter').css('background-color', '#606060');
				break;
			} else if (callFrom == 0) {
				if (roleTop2)
					$('#topEditer').css('background-color', '#EE6F59');
				else
					$('#topEditer').css('background-color', '#606060');
				break;
			}
		case 'jg':
			roleJg = !roleJg;
			if (callFrom == 1) {
				if (roleJg)
					$('#jgFilter').css('background-color', '#EE6F59');
				else
					$('#jgFilter').css('background-color', '#606060');
				break;
			} else if (callFrom == 0) {
				if (roleJg2)
					$('#jgEditer').css('background-color', '#EE6F59');
				else
					$('#jgEditer').css('background-color', '#606060');
				break;
			}
		case 'mid':
			roleMid = !roleMid;
			if (callFrom == 1) {
				if (roleMid)
					$('#midFilter').css('background-color', '#EE6F59');
				else
					$('#midFilter').css('background-color', '#606060');
				break;
			} else if (callFrom == 0) {
				if (roleMid2)
					$('#midEditer').css('background-color', '#EE6F59');
				else
					$('#midEditer').css('background-color', '#606060');
				break;
			}
		case 'adc':
			roleAdc = !roleAdc;
			if (callFrom == 1) {
				if (roleAdc)
					$('#adcFilter').css('background-color', '#EE6F59');
				else
					$('#adcFilter').css('background-color', '#606060');
				break;
			} else if (callFrom == 0) {
				if (roleAdc2)
					$('#adcEditer').css('background-color', '#EE6F59');
				else
					$('#adcEditer').css('background-color', '#606060');
				break;
			}
		case 'supp':
			roleSupp = !roleSupp;
			if (callFrom == 1) {
				if (roleSupp)
					$('#suppFilter').css('background-color', '#EE6F59');
				else
					$('#suppFilter').css('background-color', '#606060');
				break;
			} else if (callFrom == 0) {
				if (roleSupp2)
					$('#suppEditer').css('background-color', '#EE6F59');
				else
					$('#suppEditer').css('background-color', '#606060');
				break;
			}
		default:
			break;
	}
}

function filterGameType(gameTypeFilter, callerClass) {
	switch (gameTypeFilter) {
		case 'soloduo':
			soloduo = !soloduo;
			if (soloduo)
				$('.' + callerClass + ':nth-of-type(1)').css('background-color', '#EE6F59');
			else
				$('.' + callerClass + ':nth-of-type(1)').css('background-color', '#343a40');
			break;
		case 'flex':
			flex = !flex;
			if (flex)
				$('.' + callerClass + ':nth-of-type(2)').css('background-color', '#EE6F59');
			else
				$('.' + callerClass + ':nth-of-type(2)').css('background-color', '#343a40');
			break;
		case 'normal':
			norm = !norm;
			if (norm)
				$('.' + callerClass + ':nth-of-type(3)').css('background-color', '#EE6F59');
			else
				$('.' + callerClass + ':nth-of-type(3)').css('background-color', '#343a40');
			break;
		case 'aram':
			aram = !aram;
			if (aram)
				$('.' + callerClass + ':nth-of-type(4)').css('background-color', '#EE6F59');
			else
				$('.' + callerClass + ':nth-of-type(4)').css('background-color', '#343a40');
			break;
		default:
			break;
	}
}

function filterGrindOrFun(filter, callerId) {
	switch (filter) {
		case 'grind':
			if (callerId == 'Filter') {
				grind = !grind;
				if (grind)
					$('#grind' + callerId).css('background-color', '#EE6F59');
				else
					$('#grind' + callerId).css('background-color', 'grey');
				break;
			} else if (callerId == 'Filter2') {
				grind2 = !grind2;
				if (grind2)
					$('#grind' + callerId).css('background-color', '#EE6F59');
				else
					$('#grind' + callerId).css('background-color', 'grey');
				break;
			}
		case 'fun':
			if (callerId == 'Filter') {
				fun = !fun;
				if (fun)
					$('#fun' + callerId).css('background-color', '#EE6F59');
				else
					$('#fun' + callerId).css('background-color', 'grey');
				break;
			} else if (callerId == 'Filter2') {
				fun2 = !fun2;
				if (fun2)
					$('#fun' + callerId).css('background-color', '#EE6F59');
				else
					$('#fun' + callerId).css('background-color', 'grey');
				break;
			}
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

	console.log('Mic: ' + mic);
	console.log('No Mic: ' + noMic);

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

	if (micFilter == 0) {
		mic = true;
		noMic = true;
	} else if (micFilter == 1) {
		mic = true;
		noMic = false;
	} else if (micFilter == 2) {
		mic = false;
		noMic = true;
	}

	if (!mic || !noMic) {
		applyMicFilter();
	} else {
		//jokes again lol
	}
	appendList(soloDuoListF, flexListF, normListF, aramListF);
}

function appendList(list1, list2, list3, list4) {
	$('#soloduoSummonersList div').empty();
	if (soloduo) {
		appendListHelper(list1, "soloduoSummonersList");
	}

	$('#flexSummonersList div').empty();
	if (flex) {
		appendListHelper(list2, "flexSummonersList");
	}

	$('#normSummonersList div').empty();
	if (norm) {
		appendListHelper(list3, "normSummonersList");
	}

	$('#aramSummonersList div').empty();
	if (aram) {
		appendListHelper(list4, "aramSummonersList");
	}
}

/**
 * Creating List to show player entry 
 */
function appendListHelper(list, id) {

	var row = ("");

	switch (id) {
		case "soloduoSummonersList":
			row = row.concat("<div class=\"listType\" align=\"center\">Solo/Duo</div>");
			break;
		case "flexSummonersList":
			row = row.concat("<div class=\"listType\" align=\"center\">Flex</div>");
			break;
		case "normSummonersList":
			row = row.concat("<div class=\"listType\" align=\"center\">Normal</div>");
			break;
		case "aramSummonersList":
			row = row.concat("<div class=\"listType\" align=\"center\">Aram</div>");
			break;
		default:
			break;
	}

	for (var player in list) {
		row = row.concat("<div class=\"player-list-card row offset-2 \">");
		row = row.concat("");
		row = row.concat("<!-- Left Side -->");
		row = row.concat("    <div class=\"player-info-section col-5\" style=\"border: 1px solid black; background-color: rgba(255, 255, 255, 0.05);\">");
		row = row.concat("        <div class=\"row\" style=\"margin: 1.2vw\">");
		row = row.concat("            <div class=\"col-4\" style=\"margin-top: 2vw\">");
		row = row.concat("                <div class=\"row\" align=\"center\">");
		row = row.concat("                    <div class=\"user-icon col text-center\" >");
		row = row.concat("                    <img src=\"http://ddragon.leagueoflegends.com/cdn/8.18.2/img/profileicon/" + list[player].profileIconId + ".png\" height=\"150vw\" \/> "); //visit this link to check for the latest patch https://ddragon.leagueoflegends.com/api/versions.json
		row = row.concat("                    <\/div>");
		row = row.concat("                    <div class=\"user-ign col text-center\">");
		row = row.concat("                        <p style=\"font-family: fantasy; font-size: 28px;\">" + list[player].userIgn + "<\/p>");
		row = row.concat("                    <\/div>");
		row = row.concat("                <\/div>");
		row = row.concat("            <\/div>");
		row = row.concat("            <div class=\"col\" style=\"margin-top: 1.2vw; \">");
		row = row.concat("                <div class=\"row\" style=\"margin: 0vw 0vw 1vw 0vw;\">");
		row = row.concat("                    <div class=\"user-stats col text-center\" style=\"border: 1px solid black; \">");
		row = row.concat("                        <div class=\"row\">");
		row = row.concat("                            <table class=\"player-info-text col outer\" style=\"margin: 0vw; background-color: #343a40;\">");
		row = row.concat("                                <tr class=\"player-info-border\">");
		row = row.concat("                                    <td class=\"player-rank-icon\" style=\"padding: 7px;\">");
		row = row.concat("                                        <img src=\"./pictures/tier/" + tierDict[decodeTier(list[player].soloRank)] + ".png\" width=\"110px\"\/>");
		row = row.concat("                                    <\/td>");
		row = row.concat("                                    <td>");
		row = row.concat("                                        <p style=\"margin-bottom: 0.5rem;\">" + tierDict[decodeTier(list[player].soloRank)] + "  " + decodeRank(list[player].soloRank) + "<\/p>");
		row = row.concat("                                        <p style=\"margin-bottom: 0.5rem;\">" + list[player].soloLeaguePoints + "LP / " + list[player].soloRankWins + "W " + list[player].soloRankLosses + "L<\/p>");
		row = row.concat("                                        <p style=\"margin-bottom: 0.5rem;\">Win Ratio " + Math.round(list[player].soloRankWins / (list[player].soloRankWins + list[player].soloRankLosses) * 100) + "%<\/p>");
		row = row.concat("                                    <\/td>");
		row = row.concat("                                <\/tr>");
		row = row.concat("                            <\/table>");
		row = row.concat("				      		  <table class=\"player-info-text col outer\" style=\"margin: 0vw; background-color: #343a40;\">");
		row = row.concat("                    		      <tr>");
		row = row.concat("                    		          <td class=\"player-rank-icon\">");
		row = row.concat("                    		              <img src=\"./pictures/tier/" + tierDict[decodeTier(list[player].flexRank)] + ".png\" width=\"70px\"\/>");
		row = row.concat("                    		          <\/td>");
		row = row.concat("                    		          <td>");
		row = row.concat("                    		              <p style=\"margin-bottom: 0.2rem;\">" + tierDict[decodeTier(list[player].flexRank)] + "  " + decodeRank(list[player].flexRank) + "<\/p>");
		row = row.concat("                    		              <p style=\"margin-bottom: 0.2rem;\">" + list[player].flexLeaguePoints + "LP / " + list[player].flexRankWins + "W " + list[player].flexRankLosses + "L<\/p>");
		row = row.concat("                    		              <p style=\"margin-bottom: 0.2rem;\">Win Ratio " + Math.round(list[player].flexRankWins / (list[player].flexRankWins + list[player].flexRankLosses) * 100) + "%<\/p>");
		row = row.concat("                    		          <\/td>");
		row = row.concat("                    		      <\/tr>");
		row = row.concat("                    		  <\/table>");
		row = row.concat("                        <\/div>");
		row = row.concat("                    <\/div>");
		row = row.concat("                <\/div> ");
		row = row.concat("                <div class=\"row\">");

		// row = row.concat("                    <div class=\"col\" align=\"center\" style=\"margin-bottom: 1vw\">");
		// row = row.concat("                        <button>Flex Rank<\/button>");
		// row = row.concat("                    <\/div>");
		row = row.concat("                <\/div>");
		row = row.concat("            <\/div>");
		row = row.concat("        <\/div>");
		row = row.concat("    <\/div>");
		row = row.concat("");
		row = row.concat("<!-- Right Side -->");
		row = row.concat("    <div class=\"player-preference-section col-4\" style=\"background-color: rgba(255, 255, 255, 0.05); border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black\">");
		row = row.concat("        <div class=\"posted-date col\" style=\"margin: 0.3vw 0vw 0.3vw 1.3vw; text-align: right \">Date Posted: " + list[player].postedTime + "<\/div>");
		row = row.concat("        <br \/>");
		row = row.concat("        <div class=\"row align-items-end\">");
		row = row.concat("            <div class=\"col-10 offset-1 bg-dark \" style=\"border: 1px solid black; color: white; height: 7vw; padding: 0.7vw\">" + list[player].notes + "<\/div>");
		row = row.concat("        <\/div>");
		row = row.concat("        <br \/>");
		row = row.concat("        <div class=\"user-preference-icons row justify-content-center\">");
		row = row.concat("            <div class=\"col-10\">");
		row = row.concat("                <div class=\"row justify-content-center\"> ");
		row = row.concat("                    <!-- For loop for info, add margin spacing in between - 0.3vw -->");
		row = row.concat("                    <div class=\"player-roles\">");
		row = row.concat(appendCheckedRoles(list[player].roles));
		row = row.concat("                    <\/div>");

		if (list[player].micAvail == 1) {
			row = row.concat("                <img src=\"pictures/mic/mic.png\" width=\"40px\" height=\"40px\" style=\"margin-right: 0.3vw\"/>");
		}
		else {
			row = row.concat("                <img src=\"pictures/mic/no_mic.png\" width=\"40px\" height=\"40px\" style=\"margin-right: 0.3vw\"/>");
		}

		row = row.concat("                    <div class=\"game-type\" style=\"margin-right: 0.8vw\">");
		row = row.concat(appendChecked(list[player].gameType));
		row = row.concat("                    <\/div>");

		if (list[player].grindorfun == 2) {
			row = row.concat("                <div class=\"play-style\" style=\"margin-right: 0.8vw\">");
			row = row.concat("                    Grind/Fun");
			row = row.concat("                <\/div>");
		}
		else if (list[player].grindorfun == 1) {
			row = row.concat("                <div class=\"play-style\" style=\"margin-right: 0.8vw\">");
			row = row.concat("                    Grind");
			row = row.concat("                <\/div>");
		}
		else {
			row = row.concat("                <div class=\"play-style\" style=\"margin-right: 0.8vw\">");
			row = row.concat("                    Fun");
			row = row.concat("                <\/div>");
		}

		row = row.concat("                <\/div>");
		row = row.concat("            <\/div>");
		row = row.concat("        <\/div>");
		row = row.concat("    <\/div>");
		row = row.concat("<\/div>");
		row = row.concat("<\/br \/>");
	}

	document.getElementById(id).innerHTML += row;
}

function appendCheckedRoles(datas) {
	var row = "<td>";
	for (var data in datas) {
		if (datas[data]) {
			switch (data) {
				case 'fill':
					row = row.concat("<img src=\"pictures/role_icons/Fill_icon.png\" width=\"40px\" style=\"margin-right: 0.3vw\"/>");
					break;
				case 'top':
					row = row.concat("<img src=\"pictures/role_icons/Top_icon.png\" width=\"40px\" style=\"margin-right: 0.3vw\"/>");
					break;
				case 'jg':
					row = row.concat("<img src=\"pictures/role_icons/Jungle_icon.png\" width=\"40px\" style=\"margin-right: 0.3vw\"/>");
					break;
				case 'mid':
					row = row.concat("<img src=\"pictures/role_icons/Mid_icon.png\" width=\"40px\" style=\"margin-right: 0.3vw\"/>");
					break;
				case 'adc':
					row = row.concat("<img src=\"pictures/role_icons/Bot_icon.png\" width=\"40px\" style=\"margin-right: 0.3vw\"/>");
					break;
				case 'supp':
					row = row.concat("<img src=\"pictures/role_icons/Support_icon.png\" width=\"40px\" style=\"margin-right: 0.3vw\"/>");
					break;
			}
		}
	}
	row = row.concat("</td>");
	return row;
}

function appendChecked(datas) {
	var row = "<td>";
	for (var data in datas) {
		if (datas[data])
			row = row.concat(data + "/");
	}
	row = row.concat("</td>");
	return row;
}

// Sort list of summoner into 4 lists of each game type
// This is done at the beginning to make the list but only some lists are shown
// depending on the user's choice. (makes it efficient for us as we dont need to 
// enter the database everytime when the user changes filters)
function sortGameType(summoner) {
	if (summoner.userIgn != userIgn) {
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
	} else {
		if (!posted) {
			posted = true;

			$('#masterUser div').empty();
			var row = ("");
			row = row.concat("<div class=\"player-list-card row offset-2 \">");
			row = row.concat("");
			row = row.concat("<!-- Left Side -->");
			row = row.concat("    <div class=\"player-info-section col-5\" style=\"border: 1px solid black; background-color: rgba(255, 255, 255, 0.05);\">");
			row = row.concat("        <div class=\"row\" style=\"margin: 1.2vw\">");
			row = row.concat("            <div class=\"col-4\" style=\"margin-top: 2vw\">");
			row = row.concat("                <div class=\"row\" align=\"center\">");
			row = row.concat("                    <div class=\"user-icon col text-center\" >");
			row = row.concat("                    <img src=\"http://ddragon.leagueoflegends.com/cdn/8.18.2/img/profileicon/" + summoner.profileIconId + ".png\" height=\"150vw\" \/> "); //visit this link to check for the latest patch https://ddragon.leagueoflegends.com/api/versions.json
			row = row.concat("                    <\/div>");
			row = row.concat("                    <div class=\"user-ign col text-center\">");
			row = row.concat("                        <p style=\"font-family: fantasy; font-size: 28px;\">" + summoner.userIgn + "<\/p>");
			row = row.concat("                    <\/div>");
			row = row.concat("                <\/div>");
			row = row.concat("            <\/div>");
			row = row.concat("            <div class=\"col\" style=\"margin-top: 1.2vw; \">");
			row = row.concat("                <div class=\"row\" style=\"margin: 0vw 0vw 1vw 0vw;\">");
			row = row.concat("                    <div class=\"user-stats col text-center\" style=\"border: 1px solid black; \">");
			row = row.concat("                        <div class=\"row\">");
			row = row.concat("                            <table class=\"player-info-text col outer\" style=\"margin: 0vw; background-color: #343a40;\">");
			row = row.concat("                                <tr class=\"player-info-border\">");
			row = row.concat("                                    <td class=\"player-rank-icon\" style=\"padding: 7px;\">");
			row = row.concat("                                        <img src=\"./pictures/tier/" + tierDict[decodeTier(summoner.soloRank)] + ".png\" width=\"110px\"\/>");
			row = row.concat("                                    <\/td>");
			row = row.concat("                                    <td>");
			row = row.concat("                                        <p style=\"margin-bottom: 0.5rem;\">" + tierDict[decodeTier(summoner.soloRank)] + "  " + decodeRank(summoner.soloRank) + "<\/p>");
			row = row.concat("                                        <p style=\"margin-bottom: 0.5rem;\">" + summoner.soloLeaguePoints + "LP / " + summoner.soloRankWins + "W " + summoner.soloRankLosses + "L<\/p>");
			row = row.concat("                                        <p style=\"margin-bottom: 0.5rem;\">Win Ratio " + Math.round(summoner.soloRankWins / (summoner.soloRankWins + summoner.soloRankLosses) * 100) + "%<\/p>");
			row = row.concat("                                    <\/td>");
			row = row.concat("                                <\/tr>");
			row = row.concat("                            <\/table>");
			row = row.concat("				      		  <table class=\"player-info-text col outer\" style=\"margin: 0vw; background-color: #343a40;\">");
			row = row.concat("                    		      <tr>");
			row = row.concat("                    		          <td class=\"player-rank-icon\">");
			row = row.concat("                    		              <img src=\"./pictures/tier/" + tierDict[decodeTier(summoner.flexRank)] + ".png\" width=\"70px\"\/>");
			row = row.concat("                    		          <\/td>");
			row = row.concat("                    		          <td>");
			row = row.concat("                    		              <p style=\"margin-bottom: 0.2rem;\">" + tierDict[decodeTier(summoner.flexRank)] + "  " + decodeRank(summoner.flexRank) + "<\/p>");
			row = row.concat("                    		              <p style=\"margin-bottom: 0.2rem;\">" + summoner.flexLeaguePoints + "LP / " + summoner.flexRankWins + "W " + summoner.flexRankLosses + "L<\/p>");
			row = row.concat("                    		              <p style=\"margin-bottom: 0.2rem;\">Win Ratio " + Math.round(summoner.flexRankWins / (summoner.flexRankWins + summoner.flexRankLosses) * 100) + "%<\/p>");
			row = row.concat("                    		          <\/td>");
			row = row.concat("                    		      <\/tr>");
			row = row.concat("                    		  <\/table>");
			row = row.concat("                        <\/div>");
			row = row.concat("                    <\/div>");
			row = row.concat("                <\/div> ");
			row = row.concat("                <div class=\"row\">");

			// row = row.concat("                    <div class=\"col\" align=\"center\" style=\"margin-bottom: 1vw\">");
			// row = row.concat("                        <button>Flex Rank<\/button>");
			// row = row.concat("                    <\/div>");
			row = row.concat("                <\/div>");
			row = row.concat("            <\/div>");
			row = row.concat("        <\/div>");
			row = row.concat("    <\/div>");
			row = row.concat("");
			row = row.concat("<!-- Right Side -->");
			row = row.concat("    <div class=\"player-preference-section col-4\" style=\"background-color: rgba(255, 255, 255, 0.05); border-top: 1px solid black; border-right: 1px solid black; border-bottom: 1px solid black\">");
			row = row.concat("        <div class=\"posted-date col\" style=\"margin: 0.3vw 0vw 0.3vw 1.3vw; text-align: right \">Date Posted: " + summoner.postedTime + "<\/div>");
			row = row.concat("        <br \/>");
			row = row.concat("        <div class=\"row align-items-end\">");
			row = row.concat("            <div class=\"col-10 offset-1 bg-dark \" style=\"border: 1px solid black; color: white; height: 7vw; padding: 0.7vw\">" + summoner.notes + "<\/div>");
			row = row.concat("        <\/div>");
			row = row.concat("        <br \/>");
			row = row.concat("        <div class=\"user-preference-icons row justify-content-center\">");
			row = row.concat("            <div class=\"col-10\">");
			row = row.concat("                <div class=\"row justify-content-center\"> ");
			row = row.concat("                    <!-- For loop for info, add margin spacing in between - 0.3vw -->");
			row = row.concat("                    <div class=\"player-roles\">");
			row = row.concat(appendCheckedRoles(summoner.roles));
			row = row.concat("                    <\/div>");

			if (summoner.micAvail == 1) {
				row = row.concat("                <img src=\"pictures/mic/mic.png\" width=\"40px\" height=\"40px\" style=\"margin-right: 0.3vw\"/>");
			}
			else {
				row = row.concat("                <img src=\"pictures/mic/no_mic.png\" width=\"40px\" height=\"40px\" style=\"margin-right: 0.3vw\"/>");
			}

			row = row.concat("                    <div class=\"game-type\" style=\"margin-right: 0.8vw\">");
			row = row.concat(appendChecked(summoner.gameType));
			row = row.concat("                    <\/div>");

			if (summoner.grindorfun == 2) {
				row = row.concat("                <div class=\"play-style\" style=\"margin-right: 0.8vw\">");
				row = row.concat("                    Grind/Fun");
				row = row.concat("                <\/div>");
			}
			else if (summoner.grindorfun == 1) {
				row = row.concat("                <div class=\"play-style\" style=\"margin-right: 0.8vw\">");
				row = row.concat("                    Grind");
				row = row.concat("                <\/div>");
			}
			else {
				row = row.concat("                <div class=\"play-style\" style=\"margin-right: 0.8vw\">");
				row = row.concat("                    Fun");
				row = row.concat("                <\/div>");
			}

			row = row.concat("                <\/div>");
			row = row.concat("            <\/div>");
			row = row.concat("        <\/div>");
			row = row.concat("    <\/div>");
			row = row.concat("<\/div>");
			row = row.concat("<\/br \/>");
		}
		document.getElementById("masterUser").innerHTML += row;
	}
}

function showCheckboxes(from) {
	var checkboxes = document.getElementById("checkboxes_" + from);
	if (from == 'gametype') {
		if (!expanded) {
			checkboxes.style.display = "block";
			expanded = true;
		} else {
			checkboxes.style.display = "none";
			expanded = false;
		}
	} else if (from == 'gametype2') {
		if (!expanded2) {
			checkboxes.style.display = "block";
			expanded2 = true;
		} else {
			checkboxes.style.display = "none";
			expanded2 = false;
		}
	}
}

// if the user wants to see both mic and no mic people micFilter = 0 
// only wants to see mic then micFilter = 1, no mic = 2
function micFilterClicked(answer, callerId) {
	if (answer == 'mic' && callerId == 'Icon') {
		if (micFilter == 0) {
			$('#mic' + callerId).css('background-color', '#606060');
			micFilter = 2;
		} else if (micFilter == 1) {
			$('#noMic' + callerId).css('background-color', '#EE6F59');
			$('#mic' + callerId).css('background-color', '#606060');
			micFilter = 2;
		} else if (micFilter == 2) {
			$('#mic' + callerId).css('background-color', '#EE6F59');
			micFilter = 0;
		}
	} else if (answer == 'noMic' && callerId == 'Icon') {
		if (micFilter == 0) {
			$('#noMic' + callerId).css('background-color', '#606060');
			micFilter = 1;
		} else if (micFilter == 1) {
			$('#noMic' + callerId).css('background-color', '#EE6F59');
			micFilter = 0;
		} else if (micFilter == 2) {
			$('#mic' + callerId).css('background-color', '#EE6F59');
			$('#noMic' + callerId).css('background-color', '#606060');
			micFilter = 1;
		}
	} else if (answer == 'mic' && callerId == 'Icon2') {
		if (micFilter2 == 0) {
			$('#mic' + callerId).css('background-color', '#606060');
			micFilter2 = 2;
		} else if (micFilter2 == 1) {
			$('#noMic' + callerId).css('background-color', '#EE6F59');
			$('#mic' + callerId).css('background-color', '#606060');
			micFilter2 = 2;
		} else if (micFilter2 == 2) {
			$('#mic' + callerId).css('background-color', '#EE6F59');
			micFilter2 = 0;
		}
	} else if (answer == 'noMic' && callerId == 'Icon2') {
		if (micFilter2 == 0) {
			$('#noMic' + callerId).css('background-color', '#606060');
			micFilter2 = 1;
		} else if (micFilter2 == 1) {
			$('#noMic' + callerId).css('background-color', '#EE6F59');
			micFilter2 = 0;
		} else if (micFilter2 == 2) {
			$('#mic' + callerId).css('background-color', '#EE6F59');
			$('#noMic' + callerId).css('background-color', '#606060');
			micFilter2 = 1;
		}
	}
}