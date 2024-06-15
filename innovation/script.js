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
}

if (title === 'TAP - Transit & Perks') {
    intro()
    lastTrip()
}

if (title === 'TAP - Rewards') {
    genPoints()
}