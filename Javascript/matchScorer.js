export function comp101_score(points, player){
    /*
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server. It return the tuple of the score in tennis game, 
    the winner, and the remainder points of the game.
    */
    
    var player0s = 0;
    var player1s = 0;
    
    // count who get the point
    for (let a of points){
        if (a == 0){
            player0s += 1;
        } else if (a == 1){
            player1s += 1;
        }
    }
    // returning the value depending on the viewer
    if (player == 1){
        return [player1s, player0s];
    } else if (player == 0){
        return [player0s, player1s];
    }
};

export function comp101_tiebreaker(points, server){
    /*
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server. It return the tuple of the tiebreaker score in 
    tennis game, the winner, and the remainder points of the game.
    */

    let player0s = 0;
    let player1s = 0;
    let remainder = [];
    let winner = null;
    // count the point
    for (var a of points){
        // This part will be skipped if someone have got 7 points
        if (player0s < 7 && player1s < 7){
            if (a === 0){
                player0s += 1;
            } else if (a === 1){
                player1s += 1;
            }
        // After skip if the game have done, point go to remainder
        } else if (Math.abs(player0s - player1s) >= 2){
            remainder.push(a);
        // After skip if the game haven't done, continue point count
        } else if (Math.abs(player0s - player1s) < 2){
            if (a === 0){
                player0s += 1;
            } else if (a === 1){
                player1s += 1;
            }
        }
    }

    //  Deciding the winner if the game has done
    if (Math.abs(player0s - player1s) >= 2 && (player0s >= 7 || player1s >= 7)){
        if (player0s > player1s){
            winner = 0;
        } else if (player1s > player0s){
            winner = 1;
        }
    }
    // returning the value depending on the viewer
    if (server === 1){
        return [`${player1s}-${player0s}`, winner, remainder];
    } else if (server === 0){
        return [`${player0s}-${player1s}`, winner, remainder];
    }
}

export function comp101_game(points, server){
    let player0s = 0;
    let player1s = 0;
    let remainder = [];
    let winner = null;
    //  Counting the score
    for (let a of points){
        //  Add remainder to list when the game is done
        if (player0s === "W" || player1s === "W"){
            remainder.push(a);
        // Mechanism when there is Advantage in Deuce
        } else if (String(player0s).includes("Ad") || String(player1s).includes("Ad")){
            //  player 0 in advantage
            if (player0s === "Ad"){
                if (a == 0){
                    player0s = "W";
                } else if (a == 1){
                    player0s = 40;
                }
            }
            //  player 1 in advantage
            if (player1s === "Ad"){
                if (a === 1){
                    player1s = "W";
                } else if (a === 0){
                    player1s = 40;
                }
            }
        //  count for point until one of the player got 40(score)
        } else if (player0s < 3 && player1s < 3){
            if (a == 0){
                player0s += 1;
            } else if (a == 1){
                player1s += 1;
            }
        
        //  Mechanism for counting point when Deuce happen
        } else if (player0s == player1s){
            if (a == 0 &&  !(player0s === "Ad")){
                player0s = "Ad"
                player1s = 40
            } else if (a == 1 && !(player1s === "Ad")){
                player1s = "Ad"
                player0s = 40
            }
        //  Count the point and decide Deuce happen or not by adjusting point
        } else if (Math.max(player0s, player1s) == player0s){
            if (a == 0){
                player0s = "W";
            } else if (a == 1){
                player1s += 1;
            }
        } else if (Math.max(player0s, player1s) == player1s){
            if (a == 1){
                player1s = "W";
            } else if (a == 0){
                player0s += 1;
            }
        }   
    }
    //  count converter to actual score
    if (player1s == 1){
        player1s = 15;
    } else if (player1s == 2){
        player1s = 30;
    } else if (player1s == 3){
        player1s = 40;
    }

    if (player0s == 1){
        player0s = 15;
    } else if (player0s == 2){
        player0s = 30;
    } else if (player0s == 3){
        player0s = 40;
    }

    //  Conditional to decide who is the winner or no winner at all
    if (player0s === "W"){
        winner = 0;
    } else if (player1s === "W"){
        winner = 1;
    }
    
    //  Condition to return based on the server
    if (server == 1){
        return [`${player1s}-${player0s}`, winner, remainder];
    } else if (server == 0){
        return [`${player0s}-${player1s}`, winner, remainder];
    }
}

export function comp101_set(points, server, tiebreaker=comp101_tiebreaker,
                game=comp101_game){
    /*
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server. It return the tuple of the setscore in tennis game,
    the winner, and the remainder points of the set.
    */
    let winner = 0;
    let win1 = 0;
    let win0 = 0;
    let remainder = [];
    let updatedPoint = points;
    //  Calculate the set score before one of the player reach 6
    while ((winner == 0 || winner == 1) && win1 != 6 && win0 != 6){
        let res_game = game(updatedPoint, server);
        winner = res_game[1];
        if (winner == 1){
            win1 += 1;
            updatedPoint = res_game[2];
            remainder = updatedPoint;
        } else if (winner == 0){
            win0 += 1;
            updatedPoint = res_game[2];
            remainder = updatedPoint;
        } else {
            remainder = [];
            break;
        }
    }
    //  Calculate the set points and decide if tiebreaker happen
    if (win1 == 5 || win0 == 5){
        let res_game = game(updatedPoint, server);
        updatedPoint = res_game[2];
        //  Scoring if tiebreak didn't happen
        if (res_game[1] == 0 && win1 == 5){
            win0 += 1;
        } else if (res_game[1] == 1 && win0 == 5) {
            win1 += 1;
        //  Mechanism for tiebreak
        } else if (res_game[1] == 0 && win1 == 6 || res_game[1] == 1 && win0 == 6){
            win0 = win1 = 6;
            let res_final = tiebreaker(updatedPoint, server);
            winner = res_final[1];
            if (winner == 1){
                win1 += 1;
            } else if (winner == 0){
                win0 += 1;
            }
        }
    }
    //  Condition to return based on the server
    if (server == 1){
        return [`${win1}-${win0}`, winner, remainder];
    } else if (server == 0){
        return [`${win0}-${win1}`, winner, remainder];
    }
}

export function comp101_match(points, server, maxlen, tiebreaker=comp101_tiebreaker,
                  game=comp101_game, set_score=comp101_set){
    /*
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server, and integer for maxlen. It return the tuple of the 
    match scores in tennis game which consist of setscore and followed by game
    score.
    */
    let winner = 0;
    let match = "";
    let setscore = null;
    let countset = 0;
    let updatedPoint = points;
    let remainder = [];
    let setscore0 = null;
    let setscore1 = null;
    let gamescore = null;
    let gamescore0 = null;
    let gamescore1 = null;
    //  Conditional for empty point
    if (updatedPoint === []){
        return match.substring(1);
    }
    //  Counting the set and adding set score to match score 
    while (winner !== null){
        //  Conditional for counting and adding if there is a winner in the set
        if (set_score(updatedPoint, server)[1] !== null){
            setscore = set_score(updatedPoint, server);
            winner = setscore[1];
            updatedPoint = setscore[2];
            match = match + " " + setscore[0];
            countset += 1;
        //  Conditional for counting and adding if there is no winner in the set
        } else if (set_score(updatedPoint, server)[1] === null) {
            remainder = updatedPoint;
            setscore = set_score(updatedPoint, server);
            winner = setscore[1];
            updatedPoint = setscore[2];
            setscore0 = setscore[0][0];
            setscore1 = setscore[0][2];
            //  Counting and adding mechanism for no winner, ignoring (0-0) score
            if (setscore0 !== "0" || setscore1 !== "0"){
                match = match + " " + setscore[0];
                countset += 1;
            }
        }
    }
    //  Count game score if tiebreaker happen in the last set           
    if (setscore0 == "6" && setscore1 == "6"){
        //  Making the Points become the points when tiebreaker happen  
        let n = 0;
        while (n != 12){
            gamescore = game(remainder, server);
            winner = gamescore[1];
            remainder = gamescore[2];
            n += 1;
        }
        //  Adding tiebreaker score to match score and ignore (0-0) score 
        tiescore = tiebreaker(remainder, server);
        if (tiescore[0][0] != "0" || tiescore[0][2] != "0"){
            match = match + " " + gamescore[0];
        }
    //  Count game score if non-tiebreaker happen in the last set        
    } else {
        winner = 0;
        //  Adding non-tiebreaker score to match score and ignore (0-0) score
        while (winner !== null){
            gamescore = game(remainder, server);
            winner = gamescore[1];
            remainder = gamescore[2];
            gamescore0 = gamescore[0][0];
            gamescore1 = gamescore[0][2];
        }
        if (gamescore0 != "0" || gamescore1 != "0"){
            match = match + " " + gamescore[0];
        }
    }
    //  Return False if the sets happen more than maxlen
    if (countset >= maxlen){
        return false;
    } else {
        return match.substring(1);
    }
}