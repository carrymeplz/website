$(document).ready(function() {

	var queryString = decodeURIComponent(window.location.search);
	queryString = queryString.substring(1);
	var queries = queryString.split("&");
	for (var i = 0; i < queries.length; i++)
	{
		if (i == 0) {
			firebase.database().ref(queries[i].split('=')[1]).once('value').then(function(snapshot) {
		        var summoners = snapshot.val();
		        for (var key in summoners) {
					var row = "<tr>";
		        	row = row.concat("<td>" + summoners[key].userIgn + "</td>");
		        	row = row.concat("<td><img src='./pictures/profileicon/" + summoners[key].profileIconId + ".png'/></td>");
		        	row = row.concat("<td><img src='./pictures/tier/" + tierDict[decodeTier(summoners[key].soloRank)] + ".png'/></td>");
		        	row = row.concat("<td>" + tierDict[decodeTier(summoners[key].soloRank)] + "</td>");
		        	row = row.concat("<td>" + decodeRank(summoners[key].soloRank) + "</td>");
		        	row = row.concat("<td><img src='./pictures/tier/" + tierDict[decodeTier(summoners[key].flexRank)] + ".png'/></td>");
		        	row = row.concat("<td>" + tierDict[decodeTier(summoners[key].flexRank)] + "</td>");
		        	row = row.concat("<td>" + decodeRank(summoners[key].flexRank) + "</td>");
		        	row = row.concat("<td>" + summoners[key].flexRankWins + "</td>");
		        	row = row.concat("<td>" + summoners[key].flexRankLosses + "</td>");
		        	row = row.concat("<td>" + Math.round(summoners[key].flexRankWins / (summoners[key].flexRankWins + summoners[key].flexRankLosses) * 100) + "</td>");
		        	row = row.concat("<td>" + summoners[key].soloRankWins + "</td>");
		        	row = row.concat("<td>" + summoners[key].soloRankLosses + "</td>");
		        	row = row.concat("<td>" + Math.round(summoners[key].soloRankWins / (summoners[key].soloRankWins + summoners[key].soloRankLosses) * 100) + "</td>");
		        	row = row.concat(appendChecked(summoners[key].roles));
		        	row = row.concat(appendChecked(summoners[key].gameType));
					if (summoners[key].grindorfun == 2)
			        	row = row.concat("<td>grind/fun</td>");
		            else if (summoners[key].grindorfun == 1)
			        	row = row.concat("<td>grind</td>");
		            else
			        	row = row.concat("<td>fun</td>");
		            if (summoners[key].micAvail == 1)
			        	row = row.concat("<td>yes</td>");
		            else
			        	row = row.concat("<td>no</td>");
			        row = row.concat("<td>" + summoners[key].notes + "</td>")
		            row = row.concat("</tr>");
		            console.log(row);
				    $('#summonersList').find('tbody').append(row);
		        }
		    });
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
})