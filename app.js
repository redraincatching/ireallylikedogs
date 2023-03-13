let users = {
    // some sample data
    user1: { 'a': 1, 'c': 1 },
    user2: { 'b': 1, 'd': -1 },
    user3: { 'c': 1 }
}

function presentArtist() {
    // first select which user is viewing it at random
    let user = Object.values(users)[Math.floor(Math.random() * 23456) % 3];

    do {
        // then generate a new artist
        let curr = Math.floor(Math.random() * 25 + 10).toString(36);

        // if artist is in this user's array, immediately go to next iteration
        for (let i = 0; i < user.length; i++) {
            if (curr == Object.values(user)[i]) {
                continue;
            }
        }

        // otherwise, check probability of user liking it, and if it's high, show it
        // may need to adjust these values based on larger sample size but i doubt it
        if (getProbability(curr) > 0.45) {
            // user has a shot of liking it, and either saves it as 1 (like) or -1 (dislike)
            if (Math.random() > 0.3) {
                console.log("liked " + curr);
                user[curr] = 1;
            }
            else {
                console.log("disliked " + curr);
                user[curr] = -1;
            }
            // then break
            break;
        }
        else {
            console.log("probability of " + curr + " not high enough");
            continue;
        }


    } while (true)

    // update list of likes (don't bother showing dislikes)
    updateLists();
}

function getProbability(item) {
    // for now
    let probability_pos = 1;
    let probability_neg = 1;

    // user likes x, so recommend y?
    // P(x|y)/P(x) * P(x + y);
    // which is
    // (times y is liked when x is there)/(occurrences of x) * (users who have liked x and y);

    // two
    // 1: times both x and y == 1
    // 2: times x == 1

    // call recommend with mode equal to 1 or 

    for (let i = 0; i < Object.keys(users).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(users)[i]).length; j++) {
            // move through every liked song and update recommendation based on that
            // the syntax for iterating through nested objects is, to use the technical term, wank
            probability_pos = probability_pos * recommend(Object.keys(Object.values(users)[i])[j], item, 1)
        }
    }



    // then the same thing for the negative probability
    for (let i = 0; i < Object.keys(users).length; i++) {
        for (let j = 0; j < Object.keys(Object.values(users)[i]).length; j++) {
            probability_neg = probability_neg * recommend(Object.keys(Object.values(users)[i])[j], item, -1)
        }
    }

    // and then get total probability, although currently it's very positively weighted
    const probability = probability_pos - probability_neg * 0.5;
    console.log(probability);

    return probability;
}

function recommend(x, y, mode) {
    // user likes x, so do we recommend y?
    // mode is whether we're checking for likes (1) or dislikes (-1)
    let totalOccurencesX = 0;   // the amount of times item x occurs
    let totalOccurencesXY = 0;  // the amount of times x and y occur together
    let totalUsersXY = 0;       // users who have either x or y occurring
    let finalProb = 0;          // explanatory

    for (const user in users) {
        // if x occurs, increment usersX and usersXY
        if (users[user][x] === mode) {
            totalOccurencesX++;
            totalUsersXY++;
            if (users[user][y] === mode) {
                // if X and Y increment occurencesXY
                totalOccurencesXY++;
            }
        } else if (users[user][y] === mode) {
            // if y occurs, increment usersXY
            totalUsersXY++;
        }
    }

    // probability of x and y is x and y over users who've liked both? not sure about this part
    // if we want to change it to over all users we can use
    // const probXY = totalOccurencesXY / Object.keys(users).length;
    const probXY = totalOccurencesXY / totalUsersXY;

    if (totalOccurencesX == 0 || totalOccurencesXY == 0) {
        // if no one's liked x or has liked x or y, then prob = mode (so basically it's in favour)
        finalProb = mode;
    }
    else {
        // otherwise finalProb is the probability found
        finalProb = probXY;
    }

    return finalProb;
}

function updateLists() {
    // this just generates a bunch of <li> item </li> tags, dw about this
    const user_list = document.querySelector(".ulist");
    user_list.innerHTML = "";

    for (let i = 0; i < Object.keys(users).length; i++) {
        let html = `<li id=${i + 1}> user ${i + 1}: `;


        for (let j = 0; j < Object.keys(Object.values(users)[i]).length; j++) {
            if (Object.values(Object.values(users)[i])[j] == 1) {
                html += `${Object.keys(Object.values(users)[i])[j]} `;
            }
        }

        html += "</li>";
        user_list.insertAdjacentHTML('beforeend', html);
    }

}
