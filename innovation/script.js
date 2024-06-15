var intros = ['Hi there,', 'Welcome', 'Hi', 'Howdy', 'Good morning,', 'Good afternoon,']
var names = ['Jake', 'Sowmya', 'Feliciti', 'Matthew', 'Cameron', 'Brad', 'Natalie']
var stops = ['!', '.']
var locations = ['95th Red Line', 'Clinton Blue Line', 'Clinton Pink Line', 'Wilson/Sheridan', 'Broadway/Belmont']

var title = document.getElementsByTagName("title")[0].innerHTML;

function randSel(arr) {
    const idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
}

function changeText(id, text) {
    document.getElementById(id).innerHTML = text
}

function range(bounds) {
    var boundIsNum = typeof(bounds) == 'number'
    if (bounds.length == 1 || boundIsNum) {
        var lowerBound = 0
    } else {
        var lowerBound = bounds[0]
    }
    if (boundIsNum) {
        var upperBound = bounds
    }
    else {
        var upperBound = bounds[bounds.length - 1]
    }
    var x = []
    while (lowerBound < upperBound) {
        x.push(lowerBound);
        lowerBound++;
    }
    return x
}

function padNum(val, padLen=2, padVal='0') {
    return val.toString().padStart(padLen, padVal)
}

function genTime() {
    let hrs = range(23), minutes = range(59)
    let hr = padNum(randSel(hrs)), minute = padNum(randSel(minutes))
    clockTime = hr + ':' + minute
    return clockTime
}

function formatDate(dateObj) {
    let day = dateObj.getDate(), month = dateObj.getMonth() + 1, year = dateObj.getFullYear()
    return padNum(month) + '/' + padNum(day) + '/' + year.toString()
}

function randomDate(start, end) {
    if (end === undefined) {
        end = new Date()
        end = end .setDate(end.getDate() - 1);
        end = new Date(end)
    }
    var date = new Date(+start + Math.random() * (end - start));
    return date;
}

function intro() {
    let welcome = randSel(intros) + ' ' + randSel(names) + randSel(stops)
    changeText('welcome', welcome)
}

function lastTrip() {
    let trip = randSel(locations)
    let time = genTime()
    let lastTripNote = trip + ' at ' + time
    // 1 in 3 chance to add the date
    if (randSel(range(3)) === 2) {
        let date = randomDate(new Date(2024, 1, 1)) // end = current date
        date = formatDate(date)
        lastTripNote += ' on ' + date
    } else {
        lastTripNote += ' today'
    }
    changeText('trip-detail', lastTripNote)
}

function genPoints() {
    let _range = range([0, 1000])
    let points = randSel(_range)
    let points_str = 'You have ' + points.toString() + ' Points!'
    changeText('points-count', points_str)
    return points
}

// Github verson (1 file .html): https://github.com/Soooda/progress_bar_lite/blob/master/index.html

function increase(span_input) {
    console.log('calling increase')
    changeText('pct-span', span_input)
    // Change the variable to modify the speed of the number increasing from 0 to (ms)
    let SPEED = 40;
    // Retrieve the percentage value
    let limit = parseInt(document.getElementById("pct-span").innerHTML, 10);

    for(let i = 0; i <= limit; i++) {
        setTimeout(function () {
            document.getElementById("pct-span").innerHTML = i + "%";
        }, SPEED * i);
    }
}


if (title === 'TAP - Transit &amp; Perks') {
    console.log('we tweakin')
    intro()
    lastTrip()
}

if (title === 'TAP - Rewards') {
    let pts = genPoints()
    let pct = (pts / 1000) * 100
    increase(pct);
}