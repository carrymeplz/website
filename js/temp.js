for (var player in list) {
    row = row.concat("<div class=\"player-list-card \">");
    row = row.concat("");
    row = row.concat("<!-- Left Side -->");
    row = row.concat("    <div class=\"player-info-section \" >");
    row = row.concat("        <div class=\"\" >");
    row = row.concat("            <div class=\"\" >");
    row = row.concat("                <div class=\"\" >");
    row = row.concat("                    <div class=\"user-icon \" >");
    row = row.concat("                    <img src=\"http://ddragon.leagueoflegends.com/cdn/8.18.2/img/profileicon/" + list[player].profileIconId + ".png\" /> "); //visit this link to check for the latest patch https://ddragon.leagueoflegends.com/api/versions.json
    row = row.concat("                    <\/div>");
    row = row.concat("                    <div class=\"user-ign \">");
    row = row.concat("                        <p >" + list[player].userIgn + "<\/p>");
    row = row.concat("                    <\/div>");
    row = row.concat("                <\/div>");
    row = row.concat("            <\/div>");
    row = row.concat("            <div class=\"\" >");
    row = row.concat("                <div class=\"\" >");
    row = row.concat("                    <div class=\"user-stats \" >");
    row = row.concat("                        <div class=\"\">");
    row = row.concat("                            <table class=\"player-info-text \" >");
    row = row.concat("                                <tr class=\"player-info-border\">");
    row = row.concat("                                    <td class=\"player-rank-icon\" >");
    row = row.concat("                                        <img src=\"./pictures/tier/" + tierDict[decodeTier(list[player].soloRank)] + ".png\"/>");
    row = row.concat("                                    <\/td>");
    row = row.concat("                                    <td>");
    row = row.concat("                                        <p >" + tierDict[decodeTier(list[player].soloRank)] + "  " + decodeRank(list[player].soloRank) + "<\/p>");
    row = row.concat("                                        <p >" + list[player].soloLeaguePoints + "LP / " + list[player].soloRankWins + "W " + list[player].soloRankLosses + "L<\/p>");
    row = row.concat("                                        <p >Win Ratio " + Math.round(list[player].soloRankWins / (list[player].soloRankWins + list[player].soloRankLosses) * 100) + "%<\/p>");
    row = row.concat("                                    <\/td>");
    row = row.concat("                                <\/tr>");
    row = row.concat("                            <\/table>");
    row = row.concat("				      		  <table class=\"player-info-text \">");
    row = row.concat("                    		      <tr>");
    row = row.concat("                    		          <td class=\"player-rank-icon\">");
    row = row.concat("                    		              <img src=\"./pictures/tier/" + tierDict[decodeTier(list[player].flexRank)] + ".png\"/>");
    row = row.concat("                    		          <\/td>");
    row = row.concat("                    		          <td>");
    row = row.concat("                    		              <p >" + tierDict[decodeTier(list[player].flexRank)] + "  " + decodeRank(list[player].flexRank) + "<\/p>");
    row = row.concat("                    		              <p >" + list[player].flexLeaguePoints + "LP / " + list[player].flexRankWins + "W " + list[player].flexRankLosses + "L<\/p>");
    row = row.concat("                    		              <p >Win Ratio " + Math.round(list[player].flexRankWins / (list[player].flexRankWins + list[player].flexRankLosses) * 100) + "%<\/p>");
    row = row.concat("                    		          <\/td>");
    row = row.concat("                    		      <\/tr>");
    row = row.concat("                    		  <\/table>");
    row = row.concat("                        <\/div>");
    row = row.concat("                    <\/div>");
    row = row.concat("                <\/div> ");
    row = row.concat("                <div class=\"\">");

    // row = row.concat("                    <div class=\"col\" align=\"center\" style=\"margin-bottom: 1vw\">");
    // row = row.concat("                        <button>Flex Rank<\/button>");
    // row = row.concat("                    <\/div>");
    row = row.concat("                <\/div>");
    row = row.concat("            <\/div>");
    row = row.concat("        <\/div>");
    row = row.concat("    <\/div>");
    row = row.concat("");
    row = row.concat("<!-- Right Side -->");
    row = row.concat("    <div class=\"player-preference-section \" >");
    row = row.concat("        <div class=\"posted-date\">Date Posted: " + list[player].postedTime + "<\/div>");
    row = row.concat("        <br \/>");
    row = row.concat("        <div class=\"\">");
    row = row.concat("            <div class=\"\">" + list[player].notes + "<\/div>");
    row = row.concat("        <\/div>");
    row = row.concat("        <br \/>");
    row = row.concat("        <div class=\"user-preference-icons \">"); //justify-content-center
    row = row.concat("            <div class=\"\">");
    row = row.concat("                <div class=\"\"> "); //justify-content-center
    row = row.concat("                    <!-- For loop for info, add margin spacing in between - 0.3vw -->");
    row = row.concat("                    <div class=\"player-roles\">");
    row = row.concat(appendCheckedRoles(list[player].roles));
    row = row.concat("                    <\/div>");

    if (list[player].micAvail == 1) {
        row = row.concat("                <img src=\"pictures/mic/mic.png\" />");
    }
    else {
        row = row.concat("                <img src=\"pictures/mic/no_mic.png\" />");
    }

    row = row.concat("                    <div class=\"game-type\" >");
    row = row.concat(appendChecked(list[player].gameType));
    row = row.concat("                    <\/div>");

    if (list[player].grindorfun == 2) {
        row = row.concat("                <div class=\"play-style\" >");
        row = row.concat("                    Grind/Fun");
        row = row.concat("                <\/div>");
    }
    else if (list[player].grindorfun == 1) {
        row = row.concat("                <div class=\"play-style\" >");
        row = row.concat("                    Grind");
        row = row.concat("                <\/div>");
    }
    else {
        row = row.concat("                <div class=\"play-style\" >");
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