var intros = ['Hi there,', 'Welcome', 'Hi', 'Howdy', 'Good morning,', 'Good afternoon,']
var names = {
    'Jake': 'Lang',
    'Sowmya': 'Monroe',
    'Feliciti': 'Crowder',
    'Matthew': 'Almendras',
    'Cameron': 'Rozek',
    'Brad': 'Skiniotes',
    'Natalie': 'Kindred'
}
var emailEnds = ['@gmail.com', '@yahoo.com', '@xyz.zyx']
var stops = ['!', '.']
var locations = ['95th Red Line', 'Clinton Blue Line', 'Clinton Pink Line', 'Wilson/Sheridan', 'Broadway/Belmont']

var title = document.getElementsByTagName("title")[0].innerHTML;
var isForms = title == 'TAP - Safety/Cleanliness Reporting'
var isReview = title == 'TAP - Reviews'


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

function formatDate(dateObj, fmt='m') {
    let day = dateObj.getDate(), month = dateObj.getMonth() + 1, year = dateObj.getFullYear()
    let monthFmt = padNum(month), dayFmt = padNum(day)
    if (fmt == 'm' || fmt === null) {
        var val = monthFmt + '/' + dayFmt + '/' + year.toString()
    } else {
        var val = year.toString() + '-' + monthFmt + '-' + dayFmt
    }
    return val
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

function getTodayDate(fmt='y') {
    let date = new Date()
    return formatDate(date, fmt)
}

function adjust24hTime(hour) {
    if (hour > 12) {
        var hour = hour - 12
        var tod = 'PM'
    } else {
        var hour = hour
        var tod = 'AM'
    }
    return [hour, tod]
}

function getNowTime(time24=false, returnTod=false) {
    let date = new Date()
    if (time24) {
        var hour_info = adjust24hTime(date.getHours())
    } else {
        hour_info = [padNum(date.getHours())]
    }
    
    let hour = hour_info[0], tod = hour_info[hour_info.length - 1]
    let minutes = date.getMinutes()
    let value =  hour.toString() + ':' + minutes.toString()
    if (returnTod) {
        value += ' ' + tod
    }
    return value
}

function intro() {
    let firstNames = Object.keys(names)
    let welcome = randSel(intros) + ' ' + randSel(firstNames) + randSel(stops)
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

function progBar(pct) {
    let pct_adj = pct * .75
    document.documentElement.style
        .setProperty('--end-width', pct_adj.toString() + '%');
    increase(pct)
}


function lightStar(star) {
    for (let i = 0; i < 5; i++) {
        document.getElementById('star' + i).setAttribute('fill', 'none')
    }
    let id = star.id
    let priorStars = Math.abs(0 - id[id.length - 1])
    let starsToLight = range([0, priorStars + 1])
    for (let i = 0; i < starsToLight.length; i++) {
        let thisStar = document.getElementById('star' + i)
        thisStar.setAttribute('fill', 'green')
    }
}

function closeBlock(e) {
    let papa = e.parentNode
    papa.remove()
}

function genEmail(firstName, lastName=null) {
    let emailEnd = randSel(emailEnds)
    let email = firstName
    if (lastName) {
        email += lastName
    }
    email += emailEnd
    return email
}

function setReviewDefaults(forms) {
    let today = getTodayDate()
    let now = getNowTime()
    var adjustValues = {
        'form-date': today,
        'form-time': now
        // 'review-route': randSel(routes)
    }
    if (forms) {
        let firstNames = Object.keys(names)
        let firstName = randSel(firstNames)
        let lastName = names[firstName]
        if (randSel([0,1]) == 1) {
            var emailLast = lastName
        } else {
            var emailLast = ''
        }
        let email = genEmail(firstName, emailLast)
        console.log('this is the email: ', email)
        adjustValues['form-first-name'] = firstName
        adjustValues['form-last-name'] = lastName
        adjustValues['form-email'] = email
    }
    var keys = Object.keys(adjustValues)
    for (let i = 0; i < keys.length; i++) {
        var key = keys[i]
        var theValue = adjustValues[key]
        var obj = document.getElementById(key)
        obj.value = theValue
    }
}


if (title === 'TAP - Transit &amp; Perks') {
    intro()
    lastTrip()
}

if (title === 'TAP - Rewards') {
    let pts = genPoints()
    let pct = (pts / 1000) * 100
    progBar(pct)
}

if (isReview || isForms) {
    setReviewDefaults(forms=isForms)
}
