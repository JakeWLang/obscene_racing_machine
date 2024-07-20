var intros = ['Hi there,', 'Welcome', 'Hi', 'Howdy', 'Good morning,', 'Good afternoon,']
var names = {
    'Jake': 'Lang',
    'Sowmya': 'Monroe',
    'Feliciti': 'Crowder',
    'Matthew': 'Almendras',
    'Cameron': 'Rozek',
    'Brad': 'Skiniotes',
    'Natalie': 'Kindred',
    'Bryan': 'Robinson'
}
var rewards = {
    '1 Day CTA Pass': 25,
    'Monthly Raffle': 50,
    'CTA Merch Gift Card': 100,
    'Local Business Discount': 150,
    'Field Museum Ticket': 250,
    '1 CTA 30-Day Pass': 450
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

function genPoints(max, product) {
    let _range = range([0, max])
    let points = randSel(_range)
    let diff = max - points
    let points_str = 'You have ' + points.toString() + ' Points!'
    points_str += '<br>You\'re now ' + diff.toString() + ' Points Toward Earning ' + '"' + product + '"'
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


getGradientColor = function(start_color, end_color, percent) {
    // strip the leading # if it's there
    start_color = start_color.replace(/^\s*#|\s*$/g, '');
    end_color = end_color.replace(/^\s*#|\s*$/g, '');
  
    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (start_color.length == 3) {
      start_color = start_color.replace(/(.)/g, '$1$1');
    }
  
    if (end_color.length == 3) {
      end_color = end_color.replace(/(.)/g, '$1$1');
    }
  
    // get colors
    var start_red = parseInt(start_color.substr(0, 2), 16),
      start_green = parseInt(start_color.substr(2, 2), 16),
      start_blue = parseInt(start_color.substr(4, 2), 16);
  
    var end_red = parseInt(end_color.substr(0, 2), 16),
      end_green = parseInt(end_color.substr(2, 2), 16),
      end_blue = parseInt(end_color.substr(4, 2), 16);
  
    // calculate new color
    var diff_red = end_red - start_red;
    var diff_green = end_green - start_green;
    var diff_blue = end_blue - start_blue;
  
    diff_red = ((diff_red * percent) + start_red).toString(16).split('.')[0];
    diff_green = ((diff_green * percent) + start_green).toString(16).split('.')[0];
    diff_blue = ((diff_blue * percent) + start_blue).toString(16).split('.')[0];
  
    // ensure 2 digits by color
    if (diff_red.length == 1) diff_red = '0' + diff_red
    if (diff_green.length == 1) diff_green = '0' + diff_green
    if (diff_blue.length == 1) diff_blue = '0' + diff_blue
  
    return '#' + diff_red + diff_green + diff_blue;
}

function makeAMix(num, denom, aColor='#F1A45F', bColor='#7EF15F') {
    let mix = num / denom
    if (mix == 1 / denom) {
        mix = 0
    }
    let color = getGradientColor(aColor, bColor, mix)
    return color
}

// function mouseStar(star) {
//     let id = star.id[star.id.length - 1]
//     let color = makeAMix(id, 4)
//     for (let i = 0; i <= id; i++) {
//         document.getElementById('star' + i).setAttribute('fill', color)
//     }
//     // document.getElementById(star.id).setAttribute('fill', color)
// }

// function mouseOffStar(star) {
//     let id = star.id[star.id.length - 1]
//     for (let i = 0; i <= id; i++) {
//         document.getElementById('star' + i).setAttribute('fill', 'none')
//     }
// }


function lightStar(star) {
    for (let i = 0; i < 5; i++) {
        document.getElementById('star' + i).setAttribute('fill', 'none')
    }
    let id = star.id
    let color = makeAMix(id[id.length-1], 5)
    let priorStars = Math.abs(0 - id[id.length - 1])
    let starsToLight = range([0, priorStars + 1])
    for (let i = 0; i < starsToLight.length; i++) {
        let thisStar = document.getElementById('star' + i)
        thisStar.setAttribute('fill', color)
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
    let selProduct = randSel(Object.keys(rewards))
    let selCost = rewards[selProduct]
    let pts = genPoints(selCost, selProduct)
    let pct = (pts / selCost) * 100
    progBar(pct)
}

if (isReview || isForms) {
    setReviewDefaults(forms=isForms)
}
