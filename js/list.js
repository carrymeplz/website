$(document).ready(function() {

	var queryString = decodeURIComponent(window.location.search);
	queryString = queryString.substring(1);
	var queries = queryString.split("&");
	for (var i = 0; i < queries.length; i++)
	{
		var row = "<tr>";
		if (i == 0){
			firebase.database().ref(queries[i].split('=')[1]).once('value').then(function(snapshot) {
		        var summoners = snapshot.val();
		        for (var key in summoners) {
		        	row = row.concat("<td>" + summoners[key].userIgn + "</td>");
		        	row = row.concat("<td>" + tierDict[decodeTier(summoners[key].soloRank)] + "</td>");
		        	row = row.concat("<td>" + decodeRank(summoners[key].soloRank) + "</td>");
		        	row = row.concat("<td>" + tierDict[decodeTier(summoners[key].flexRank)] + "</td>");
		        	row = row.concat("<td>" + decodeRank(summoners[key].flexRank) + "</td>");
		            console.log(key, summoners[key].userIgn);
		            console.log(key, summoners[key].profileIconId);
		            console.log(key, tierDict[decodeTier(summoners[key].soloRank)]);
		            console.log(key, decodeRank(summoners[key].soloRank));
		            console.log(key, tierDict[decodeTier(summoners[key].flexRank)]);
		            console.log(key, decodeRank(summoners[key].flexRank));
		            console.log(key, summoners[key].flexRankWins);
		            console.log(key, summoners[key].flexRankLosses);
		            console.log(key, summoners[key].flexRankWins / (summoners[key].flexRankWins + summoners[key].flexRankLosses) * 100);
		            console.log(key, summoners[key].soloRankWins);
		            console.log(key, summoners[key].soloRankLosses);
		            console.log(key, summoners[key].soloRankWins / (summoners[key].soloRankWins + summoners[key].soloRankLosses) * 100);
		            row = row.concat("</tr>");
		            console.log(row);
				    $('#summonersList').find('tbody').append(row);
		        }
		    });
		}
	}
})