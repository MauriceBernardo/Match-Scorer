def comp101_score(points, player):
    """
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server. It return the tuple of the score in tennis game, 
    the winner, and the remainder points of the game.
    """
    player0s = 0
    player1s = 0
    
    # count who get the point
    for a in points:
        if a == 0:
            player0s = player0s + 1
        elif a == 1:
            player1s = player1s + 1
    
    # returning the value depending on the viewer
    if player == 1:
        return (player1s, player0s)
    elif player == 0:
        return (player0s, player1s)

def comp101_tiebreaker(points, server):
    """
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server. It return the tuple of the tiebreaker score in 
    tennis game, the winner, and the remainder points of the game.
    """
    player0s = 0
    player1s = 0
    remainder = []
    winner = None
    # count the point
    for a in points:
        # This part will be skipped if someone have got 7 points
        if player0s < 7 and player1s < 7:
            if a == 0:
                player0s += 1
            elif a == 1:
                player1s += 1
        # After skip if the game have done, point go to remainder
        elif abs(player0s - player1s) >= 2:
            remainder.append(a)
        # After skip if the game haven't done, continue point count
        elif abs(player0s - player1s) < 2:
            if a == 0:
                player0s += 1
            elif a == 1:
                player1s += 1
    # Deciding the winner if the game has done
    if abs(player0s - player1s) >= 2 and (player0s >= 7 or player1s >= 7):
        if player0s > player1s:
            winner = 0
        elif player1s > player0s:
            winner = 1
    # returning the value depending on the viewer
    if server == 1:
        return (str(player1s)+"-"+str(player0s), winner, remainder)
    elif server == 0:
        return (str(player0s)+"-"+str(player1s), winner, remainder)

def comp101_game(points, server):
    player0s = 0
    player1s = 0
    remainder = []
    winner = None
    # Counting the score
    for a in points:
        # Add remainder to list when the game is done
        if player0s == "W" or player1s == "W":
            remainder.append(a)
        # Mechanism when there is Advantage in Deuce
        elif "Ad" in str(player0s) or "Ad" in str(player1s):
            # player 0 in advantage
            if player0s == "Ad":
                if a == 0:
                    player0s = "W"
                elif a == 1:
                    player0s = 40
            # player 1 in advantage
            if player1s == "Ad":
                if a == 1:
                    player1s = "W"
                elif a == 0:
                    player1s = 40
        # count for point until one of the player got 40(score)
        elif player0s < 3 and player1s < 3:
            if a == 0:
                player0s += 1
            elif a == 1:
                player1s += 1
        # Mechanism for counting point when Deuce happen
        elif player0s == player1s:
            if a == 0 and not player0s == "Ad":
                player0s = "Ad"
                player1s = 40
            elif a == 1 and not player1s == "Ad":
                player1s = "Ad"
                player0s = 40
        # Count the point and decide Deuce happen or not by adjusting point
        elif max(player0s, player1s) == player0s:
            if a == 0:
                player0s = "W"
            elif a == 1:
                player1s += 1
        elif max(player0s, player1s) == player1s:
            if a == 1:
                player1s = "W"
            elif a == 0:
                player0s += 1
    # count converter to actual score
    if player1s == 1:
        player1s = 15
    elif player1s == 2:
        player1s = 30
    elif player1s == 3:
        player1s = 40
    if player0s == 1:
        player0s = 15
    elif player0s == 2:
        player0s = 30
    elif player0s == 3:
        player0s = 40
    # Conditional to decide who is the winner or no winner at all
    if player0s == "W":
        winner = 0
    elif player1s == "W":
        winner = 1
    # Condition to return based on the server
    if server == 1:
        return (str(player1s) + "-" + str(player0s), winner, remainder)
    elif server == 0:
        return (str(player0s) + "-" + str(player1s), winner, remainder)

def comp101_set(points, server, tiebreaker=comp101_tiebreaker,
                game=comp101_game):
    """
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server. It return the tuple of the setscore in tennis game,
    the winner, and the remainder points of the set.
    """
    winner = 0
    win1 = win0 = 0
    # Calculate the set score before one of the player reach 6
    while (winner == 0 or winner == 1) and win1 != 6 and win0 != 6:
        res_game = game(points, server)
        winner = res_game[1]
        if winner == 1:
            win1 += 1
            points = res_game[2]
            remainder = points
        elif winner == 0:
            win0 += 1
            points = res_game[2]
            remainder = points
        else:
            remainder = []
    # Calculate the set points and decide if tiebreaker happen
    if win1 == 5 or win0 == 5:
        res_game = game(points, server)
        points = res_game[2]
        # Scoring if tiebreak didn't happen
        if res_game[1] == 0 and win1 == 5:
            win0 += 1
        elif res_game[1] == 1 and win0 == 5:
            win1 += 1
        # Mechanism for tiebreak
        elif res_game[1] == 0 and win1 == 6 or res_game[1] == 1 and win0 == 6:
            win0 = win1 = 6
            res_final = tiebreaker(points, server)
            remainder = res_final[2]
            winner = res_final[1]
            if winner == 1:
                win1 += 1
            elif winner == 0:
                win0 += 1
    # Condition to return based on the server
    if server == 1:
        return (str(win1) + "-" + str(win0), winner, remainder)
    elif server == 0:
        return (str(win0) + "-" + str(win1), winner, remainder)


def comp101_match(points, server, maxlen, tiebreaker=comp101_tiebreaker,
                  game=comp101_game, set_score=comp101_set):
    """
    The function takes list of number of 1 and 0 for points, and takes integer 
    of 0 and 1 for server, and integer for maxlen. It return the tuple of the 
    match scores in tennis game which consist of setscore and followed by game
    score.
    """
    winner = 0
    match = ""
    countset = 0
    # Conditional for empty point
    if points == []:
        return match[1:]
    # Counting the set and adding set score to match score 
    while winner is not None:
        # Conditional for counting and adding if there is a winner in the set
        if set_score(points, server)[1] is not None:
            setscore = set_score(points, server)
            winner = setscore[1]
            points = setscore[2]
            match = match + " " + setscore[0]
            countset += 1
        # Conditional for counting and adding if there is no winner in the set
        elif set_score(points, server)[1] is None:
            remainder = points
            setscore = set_score(points, server)
            winner = setscore[1]
            points = setscore[2]
            setscore0 = setscore[0][0]
            setscore1 = setscore[0][2]
            # Counting and adding mechanism for no winner, ignoring (0-0) score
            if setscore0 != "0" or setscore1 != "0":
                match = match + " " + setscore[0]
                countset += 1
    # Count game score if tiebreaker happen in the last set           
    if setscore0 == "6" and setscore1 == "6":
        # Making the points become the points when tiebreaker happen  
        n = 0
        while n != 12:
            gamescore = game(remainder, server)
            winner = gamescore[1]
            remainder = gamescore[2]
            n += 1
        # Adding tiebreaker score to match score and ignore (0-0) score 
        tiescore = tiebreaker(remainder, server)
        if tiescore[0][0] != "0" or tiescore[0][2] != "0":
            match = match + " " + gamescore[0]
    # Count game score if non-tiebreaker happen in the last set        
    else:
        winner = 0
        # Adding non-tiebreaker score to match score and ignore (0-0) score
        while winner is not None:
            gamescore = game(remainder, server)
            winner = gamescore[1]
            remainder = gamescore[2]
            gamescore0 = gamescore[0][0]
            gamescore1 = gamescore[0][2]
        if gamescore0 != "0" or gamescore1 != "0":
            match = match + " " + gamescore[0]
    # Return False if the sets happen more than maxlen
    if countset >= maxlen:
        return False
    else:
        return match[1:]
