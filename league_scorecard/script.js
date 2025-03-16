/*
    TODO:
        * Provide a link to the form at the top to submit
        * Add the image gallery
        * Consider adding a full table to display points by category in the page's challenge description modal
            - Do this by adapting userCatPoints to filter to just that category and sort by submissions
        * adapt sheetId, sheetName and colNameMap, catMap, catDescMap, namesToRepl, CDN from constants.json
        * Write a func that pulls all the values of a dataframe column into an array
*/
const sheetName = encodeURIComponent('Form Responses 1')
const CDN = 'https://assets.jakewlang.com'
const imgDiv = 'gallery-img'
const dateColName = 'Timestamp'
const colNameMap = {
    'Link to discord message that includes picture': 'img_link',
    "Please include a link to the discord message that includes a picture of your models.": "img_link",
    'Please mark every point you scored.': 'point_cats',
    'Please mark every point you scored. In the Other section, please include any bonus points you have earned.': "point_cats",
    'Timestamp': 'time',
    'Total point worth': 'total_points',
    "How many points in total is your submission worth?": "total_points",
    'What is your username as it appears in the discord?': 'username',
    'What unit(s) have you completed?': 'units_completed'
}
const catMap = {
    "Purchased a new set for your army: 1 pt (for each set including box sets with multiple units in them purchased)": "Buyer",
    "Purchased a new set at the Dice Dojo: additional 1pt (if purchased with proof of purchase at Dice Dojo)": "Dojo Supporter",
    "Started assembling a set for your army: 1 pt (for each unit you started assembling)": "Beginning Assembler",
    "Finished assembling a set for your army: 2 pts (for each unit you finished assembling)": "Accomplished Assembler",
    "Major conversions (Optional): 2 pt (if there are significant conversions to your units or you are doing a complicated conversion – this does not include simple head or weapon swaps, but does include things such as very involved greenstuffing or kitbashing).": "Kitbasher",
    "Primed a unit: 2 pts (for each unit primed)": "Primer",
    "Started Painting a unit: 2 pt (for each unit you started painting)": "Beginning Painter",
    "Finished Painting a unit (basic): 2 pt (for each unit you finishing painting in a basic manner, such as Slap-chop, single basecoat/wash, or otherwise very basic battle-ready scheme.)": "Accomplished Painter",
    "Finishing Painting a unit (advanced) (Optional): additional 2 pt from the above (for each unit you finished painting in an advanced manner, including multiple steps of layering and shading, picking out advanced details, and incorporating unique and non-standard effects.)": "Advanced Accomplished Painter",
    "Special Effects (Optional): 2 pt (for each unit that includes a special effect such as blood splatters, weathering, pigment powders, OSL, etc.)": "SFX Artist",
    "Advanced Techniques (Optional): 2pt (for each unit that includes advanced techniques such as NMM, highly detailed shading and highlighting, texture work, or other unique high-effort techniques.)": "Technically Advanced",
    "Basic Basing: 2 pt (for each unit that’s fully painted and then based in a simple manner, such as a single layer of texture paste. Must include a painted base rim [of any color.])": "Basic Baser",
    "Advanced Basing (Optional): additional 2pt from Basic Basing (for each unit that is based in an advanced manner, including tufting, utilizing cork or similar materials for varied height, special basing effects like water or lava, and otherwise more involved basing effort.)": "Advanced Baser",
    "Finished Unit: 5 pts (To get these points you must have completed all of the required steps in the painting category during the course of the hobby league. NOTE: varnishing is not required, but I do recommend it.)": "Unit Finisher",
}
const catDescMap = {
    "Buyer": "Purchased a new set for your army.",
    "Dojo Supporter": "Purchased a new set at the Dice Dojo.",
    "Beginning Assembler": "Started assembling a set for your army.",
    "Accomplished Assembler": "Finished assembling a set for your army.",
    "Kitbasher": "Major conversions - if there are significant conversions to your units or you are doing a complicated conversion – this does not include simple head or weapon swaps, but does include things such as very involved greenstuffing or kitbashing.",
    "Primer": "Primed a unit.",
    "Beginning Painter": "Started Painting a unit.",
    "Accomplished Painter": "Finished Painting a unit.",
    "Advanced Accomplished Painter": "For units you finished painting in an advanced manner, including multiple steps of layering and shading, picking out advanced details, and incorporating unique and non-standard effects.",
    "SFX Artist": "For units that include a special effect such as blood splatters, weathering, pigment powders, OSL, etc.",
    "Technically Advanced": "For units that include advanced techniques such as NMM, highly detailed shading and highlighting, texture work, or other unique high-effort techniques.",
    "Basic Baser": "For units that are fully painted and then based in a simple manner, such as a single layer of texture paste. Must include a painted base rim [of any color.]",
    "Advanced Baser": "For units that are based in an advanced manner, including tufting, utilizing cork or similar materials for varied height, special basing effects like water or lava, and otherwise more involved basing effort.",
    "Unit Finisher": "Completed all required steps of a unit."
}
const dataSources = {
    "Season 1 Recap": {
        'google_sheet': '1Sk1PrhvWS9oj2FSHgQnlfu-zd74C_EknYfA2cIo9ANU',
        'cutoffs': [new Date('2024/07/07'), new Date('2024/12/31')],
    },
    "Season 2 Scorecard": {
        'google_sheet': '1V-6PG_FM5aaD7xQBieN0WoaKEB2YhVReE5u5lkQzzYk',
        'cutoffs': [new Date('2025/01/20'), new Date('2025/12/31')]
    }
}

// Replaced names may include: mis-entered names and extraneous parts of names (e.g. pronouns)
// Keep it lowercase
const namesToRepl = {
    'jake_got_cake': 'Jake L',
    '(they/them)': '',
    'nick perron': 'Nick P'
}
const genNums = []
const genImgs = []
var imgI = 0

const defaultSeason = 'Season 2 Scorecard'

let sources = Object.keys(dataSources)
let buttonDiv = document.getElementById('header-buttons')
for (let i = 0; i < sources.length; i++) {
    let button = document.createElement('button')
    button.className = 'form-button'
    button.innerHTML = sources[i]

    button.addEventListener('click', function() {genSite(this.innerHTML)})
    buttonDiv.appendChild(button)
}
genSite(defaultSeason)

function makeChartTitle(seasonTitle) {
    let chartTitleText = 'Current League Standings'
    if (seasonTitle.includes('Recap')) {
        chartTitleText = 'End of Season Summary'
    }
    let chartTitle = document.getElementById('chart-title')
    chartTitle.innerHTML = chartTitleText
}

function genDataButton(link) {
    let button = document.getElementById('data-button')
    button.innerHTML = `<a class="form-button" target="_blank" href=${link}>Access the Data</a>`
}

function genSite(e) {
    newTitle = `AOS Hobby League - ${e}`
    let headerSpan = document.getElementById('page-header-season-title')

    if (newTitle != headerSpan.innerHTML) {
        let selSheetId = dataSources[e]['google_sheet']
        let selDateRange = dataSources[e]['cutoffs']
        let selURL = `https://docs.google.com/spreadsheets/d/${selSheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`
        headerSpan.innerHTML = newTitle
        
        makeChartTitle(e)

        genDataButton(`https://docs.google.com/spreadsheets/d/${selSheetId}`)
        genVisuals(selURL, selDateRange)
    }
}

function genVisuals(url, dateRange) {
    fetch(url)
        .then((response) => response.text())
        .then((fileText) => handleResponse(fileText, dateRange));
}


function csvSplit(row, splitter) {
    return row.split(splitter)
}


function parseCSV(csv, splitter) {
    const csvRows = csv.split('\n');
    const colNames = csvSplit(csvRows[0], splitter);
    let objects = [];
    for (let i = 1; i < csvRows.length; i++) {
        let thisObject = {};
        let row = csvRows[i].split(splitter);

        for (let j = 0; j < row.length; j++) {
            var val = row[j]
            let colName = colNames[j]
            let fmtColName = colNameMap[colName]
            if (colName === dateColName) {
                val = new Date(val)
            }
            if (fmtColName !== undefined) {
                colName = fmtColName
            }
            if (fmtColName === 'total_points') {
                val = val.match('[0-9]*')[0]
                val = Number(val)
            }
            if (fmtColName === 'username' | colName === 'username') {
                val = cleanUserName(val)
            }

            if (fmtColName === "point_cats") {
                let catMapKeys = Object.keys(catMap)
                let catPoint = 0
                for (k = 0; k < catMapKeys.length; k++) {
                    let activeKey = catMapKeys[k], activeVal = catMap[catMapKeys[k]]
                    val = val.replace(activeKey, activeVal)
                    let catInVal = val.includes(activeVal)
                    if (catInVal === true) {
                        catPoint = 1
                    } else {
                        catPoint = 0
                    }
                    thisObject[activeVal] = catPoint
                }
            }

            thisObject[colName] = val
        }
        
        objects.push(thisObject);
    }
    return objects;
}


function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
  }


function replNames(curUser) {
    checks = Object.keys(namesToRepl)
    for (let i = 0; i < checks.length; i++) {
        let curCheck = checks[i], curRepl = namesToRepl[checks[i]]
        curUser = curUser.replace(curCheck, curRepl)
    }
    return curUser
}


function cleanUserName(baseName) {
    // Unify names; remove any @s and periods
    let cleanerName = baseName.replace('.', '').trim().toLowerCase()
    let atIndex = cleanerName.indexOf('@')
    if (atIndex != -1) {
        cleanerName = cleanerName.slice(0, atIndex).trim()
    }
    let closerCleaner = replNames(cleanerName)
    let cleanestName = toTitleCase(closerCleaner)
    return cleanestName
}


function handleResponse(fileText, dateRange) {
    fileText = fileText.replaceAll('","', ';').replaceAll('"', '')
    let sheetObjects = parseCSV(fileText, ';');
    let totalPoints = gatherTotalPoints(sheetObjects)
    let top3 = gatherTopN(totalPoints, 3)
    let podiumSorted = podiumSort(top3)
    makePodium(podiumSorted[0], podiumSorted[1], podiumSorted[2])
    let totalData = genTotalData(totalPoints, sheetObjects)
    genTable(totalData)
    let userPointsByCat = gatherUserPointsByCat(sheetObjects)
    let catPoints = gatherCatPoints(userPointsByCat, 3)
    insertCatPoints(catPoints)

    fetch('https://assets.jakewlang.com/parsed_links.csv',
        {
        method: 'get',
        headers: {
            'content-type': 'text/csv;charset=UTF-8'
        }})
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(data => {
        let parsedImgs = parseCSV(data, ',')
        parsedImgs = filterDates(parsedImgs, dateRange)
        let randPicks = getRandFromCol(parsedImgs, 'img_filename', 10)
        setGalleryImg(randPicks, parsedImgs, sheetObjects, 'gallery-container')
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
    
}

function gatherTotalPoints(csv) {
    let totalPoints = {}

    for (let i = 0; i < csv.length; i++) {
        let row = csv[i]
        let rowUser = row['username'], rowPoints = row['total_points'];


        let currUsers = Object.keys(totalPoints)
        let currUserNew = !currUsers.includes(row['username'])
        if (currUserNew) {
            totalPoints[rowUser] = rowPoints
        } else {
            totalPoints[rowUser] += rowPoints
        }
    }
    return totalPoints
}


function gatherUserPointsByCat(data) {
    // for each row, create an entry in users if not users[entry]
    // then, within that row, create a count for each category for that user {'user': {'cat1': count1}}
    let users = {}
    let catKeys = Object.keys(catDescMap)

    for (let i = 0; i < data.length; i++) {
        let activeRow = data[i], activeUser = activeRow['username']
        if (users[activeUser] == undefined) {
            users[activeUser] = {}
        }
        for (let j = 0; j < catKeys.length; j++) {
            let activeCat = catKeys[j]
            if (users[activeUser][activeCat] == undefined) {
                users[activeUser][activeCat] = 0
            }
            users[activeUser][activeCat] += activeRow[activeCat]
        }
        
    }
    return users
}


function inArray(array, el) {
    for(var i = 0 ; i < array.length; i++) 
        if(array[i] == el) return true;
    return false;
 }
 

 function getRand(picker, choiceArray, returnInd=false, ignoreNull=true) {
    var selInd = Math.floor(Math.random()*picker.length)
    var rand = picker[selInd];
    if(!inArray(choiceArray, rand) & !(ignoreNull & rand === undefined)) {
        choiceArray.push(rand);
        if (returnInd === true) {
            rand = [rand, selInd]
        }
        return rand;
    }
    return getRand(picker, choiceArray, returnInd);
 }


 function gatherColVals(df, col) {
    nRows = df.length
    colVals = []
    for (let i = 0; i < nRows; i++) {
        colVals.push(df[i][col])
    }
    return colVals
 }


 function getRandFromCol(df, col, n) {
    if (df.length < n - 1) {
        n = df.length
    }
    const selImgs = []
    // get all the values of a column from a dataframe and make random choices of them
    colVals = gatherColVals(df, col)
    selVals = []
    for (let i = 0; i < n; i++) {
        try {
            selVals.push(getRand(colVals, selImgs, true, true))
        }
        catch (error) {
            console.log('damn, we got an issue here\n\n', error)
        }
    }
    return selVals
 }


 function filterDates(data, dateRange) {
    filtData = []
    for (let i = 0; i < data.length; i++) {
        let row = data[i]
        let rowAsTime = new Date(row['time'])
        if (rowAsTime > dateRange[0] & rowAsTime < dateRange[1]) {
            filtData.push(row)
        }
    }
    return filtData
 }


 function setGalleryImg(selImgs, imgData, allData, divToFill) {
    let firstImg = selImgs[0][0]
    let gallery = document.getElementById(divToFill)
    gallery.innerHTML = ''
    let galleryLeft = document.createElement('span'), galleryRight = document.createElement('span')
    galleryLeft.innerHTML = '<', galleryLeft.id = 'img-back'
    galleryRight.innerHTML = '>', galleryRight.id = 'img-fwd'
    galleryLeft.addEventListener('click', function() {chgImg(selImgs, false, imgData, allData)})
    galleryRight.addEventListener('click', function() {chgImg(selImgs, true, imgData, allData)})
    let galleryImg = document.createElement('img')
    galleryImg.id = imgDiv
    galleryImg.src = CDN + '/' + firstImg

    gallery.appendChild(galleryLeft)
    gallery.appendChild(galleryImg)
    gallery.appendChild(galleryRight)


    makeImgDesc(imgData, selImgs[0][1], allData)

 }


 function makeImgDesc(data, rowIndex, allData) {
    let parentRow = getParentRowFromFormLink(data[rowIndex]['form_link'], allData)
    let imgDesc = document.getElementById('gallery-img-desc')
    let descStr = ''
    if (parentRow != undefined) {
        let user = parentRow['username']
        let unit = parentRow['units_completed']
        let compDate = okDate(parentRow['time'])
        descStr = `${user}: ${unit} submitted on ${compDate}`
    }
    else {
        descStr = 'Error: No description found for unit.'
    }

    imgDesc.innerHTML = descStr
 }

 function chgImg(imgs, fwd, data, parentData) {
    let nImgs = imgs.length
    if (fwd) {
        imgI = imgI + 1
        if (imgI === nImgs) {
            imgI = 0
        }
    } else {
        imgI = imgI - 1
        if (imgI < 0) {
            imgI = nImgs - 1
        }
    }
    console.log(`this is imgs: ${imgs}\n and we are selecting for imgI ${imgI}\n\n\n`)
    let selImgName = imgs[imgI][0]
    let selImgIndex = imgs[imgI][1]
    let imgElem = document.getElementById(imgDiv)
    imgElem.src = ''
    let selImgLink = `${CDN}/${selImgName}`
    imgElem.src = selImgLink
    makeImgDesc(data, selImgIndex, parentData)
}

function getParentRowFromFormLink(formLink, parentData) {
    // Find the row where formLink from imgData == parentData['form_link']
    for (let i = 0; i < parentData.length; i++) {
        selRow = parentData[i]
        if (selRow['img_link'] == formLink) {
            break
        }
        else selRow = undefined
    }
    return selRow
}


 function selectCats(nCats, catsToPickFrom) {
    let cats = Object.keys(catsToPickFrom)
    let catsInMap = cats.length
    let catIdx = []
    for (let i = 0; i < catsInMap; i++) {
        catIdx.push(i)
    }
    let selCats = []
    for (let i = 0; i < nCats; i++) {
        let randSel = getRand(catIdx, genNums)
        selCats.push(cats[randSel])
    }
    return selCats
 }


function gatherCatPoints(userCatPoints, nCats=3) {
    let catPoints = {}
    let users = Object.keys(userCatPoints)

    for (let i = 0; i < users.length; i++) {
        let activeUser = users[i]
        let activeUserCatPoints = userCatPoints[activeUser]
        let catsInUserCatPoints = Object.keys(activeUserCatPoints)
        for (let j = 0; j < catsInUserCatPoints.length; j++) {
            var activeCat = catsInUserCatPoints[j]
            // if (selCats.includes(activeCat)) {
                if (catPoints[activeCat] == undefined) {
                    catPoints[activeCat] = {}
                }
                let activeUserCatPointsForActiveCat = activeUserCatPoints[activeCat]
                if (activeUserCatPointsForActiveCat > 0) {
                    catPoints[activeCat][activeUser] = activeUserCatPoints[activeCat]
                }
            // }
        }
    }

    let cats = Object.keys(catDescMap)
    for (let i = 0; i < cats.length; i++) {
        let activeCat = cats[i]
        if (Object.keys(catPoints[activeCat]).length == 0) {
            delete catPoints[activeCat]
        }        
    }
    let selCats = selectCats(nCats, catPoints)


    let topByCat = {}
    // Push each individual object within a cat into an array of objects to be sorted
    for (let x = 0; x < selCats.length; x ++) {
        let pointArr = []
        let activeCat = selCats[x]
        let catUsers = Object.keys(catPoints[activeCat]), catVals = Object.values(catPoints[activeCat])
        for (let y = 0; y < catUsers.length; y++) {
            let activeUser = catUsers[y], activePoints = catVals[y]
            let userObj = {'user': activeUser, 'points': activePoints}
            pointArr.push(userObj)
        }
        pointArr.sort((a, b) => (
            a.points < b.points ? 1 : b.points < a.points ? -1: 0
        ))
        let topUser = pointArr[0]
            topByCat[activeCat] = topUser
    }
    return topByCat
}


function insertCatPoints(topCatPoints) {
    // take the topCatPoints and insert separate divs into challenges-div
    // for each cat
    let cats = Object.keys(topCatPoints), vals = Object.values(topCatPoints)
    let challengeDiv = document.getElementById('challenges-div')
    challengeDiv.innerHTML = ''
    for (let i = 0; i < cats.length; i++) {
        let activeCat = cats[i], activeUser = vals[i]['user'], activePoints = vals[i]['points']
        let tempCatDiv = document.createElement('div')
        tempCatDiv.id = 'challenge-' + activeCat
        tempCatDiv.textContent = activeCat
        tempCatDiv.className = "challenge"
        challengeDiv.appendChild(tempCatDiv)

        let starDiv = document.createElement('div')
        starDiv.className = 'star-div'
        starDiv.innerHTML += '<svg version="1.1" ' + 'id="' + 'star-' + activeCat +'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 86.7 82.8" style="enable-background:new 0 0 86.7 82.8;" xml:space="preserve" onclick="makeModal(this)"> <path class="star-svg" d="M41.1,3.8c1.2-2.5,3.2-2.5,4.4,0l9.1,18.4c1.2,2.5,4.4,4.8,7.2,5.2l20.3,3c2.7,0.4,3.3,2.3,1.4,4.2L68.8,49 c-2,1.9-3.2,5.7-2.7,8.4l3.5,20.3c0.5,2.7-1.2,3.9-3.6,2.6l-18.2-9.6c-2.4-1.3-6.4-1.3-8.8,0l-18.2,9.6c-2.4,1.3-4.1,0.1-3.6-2.6 l3.5-20.3c0.5-2.7-0.8-6.5-2.7-8.4L3.2,34.7c-2-1.9-1.4-3.8,1.4-4.2l20.3-3c2.7-0.4,5.9-2.7,7.2-5.2L41.1,3.8z"/> </svg>'
        // star.src = 'images/star.svg'
        // star.className = 'challenge-star'
        tempCatDiv.appendChild(starDiv)

        let tempUserDiv = document.createElement('div')
        let submissions = ""//" " + (activePoints > 1 ? "submissions" : "submission")
        tempUserDiv.textContent = activeUser + ' - ' + activePoints + submissions
        tempCatDiv.appendChild(tempUserDiv)
    }
}


function unlightStars(this_id) {
    let starSvgs = document.getElementsByClassName('star-svg')
    for (let i = 0; i < starSvgs.length; i++) {
        let curStar = starSvgs[i]
        let curParent = curStar.parentNode
        if (curParent.id != this_id) {
            curParent.style.fill = ''
        }
    }

}


function lightStar(target) {
    let starget = document.getElementById(target.id)
    unlightStars(starget.id)

    starget.style.fill = "#f9d419"
}


function makeModal(target) {
    // make the star modal appear
    let starType = target.id.split('-')[1]
    let starText = catDescMap[starType]
    let modal = document.getElementById('star-modal')
    modal.style.display = 'flex'
    modal.innerHTML = '<span><b>' + starType + ':</b> <br>' + starText + '</span>'
    lightStar(target)

}

function onClickOutsideStarModal() {
    let starModal = document.getElementById('star-modal')
    acceptableTargets = 
        document.addEventListener('click', e => {
            let isntStarModal = e.target.id != 'star-modal'
            let isntStarSvg = e.target.className['baseVal'] != 'star-svg'
        if (isntStarModal & isntStarSvg) {
            starModal.style.display = 'none'
            unlightStars('none')
        };
        });
  };
  
  onClickOutsideStarModal('#star-modal')
  


function gatherTopN(data, n) {
    users = Object.keys(data), vals = Object.values(data)
    vals.sort(function(a, b) {
        return b - a;
    });
    vals = vals.slice(0, n)
    filtData = {}
    for (let i = 0; i < users.length; i++) {
        let activeUser = users[i]
        for (let j = 0; j < vals.length; j++) {
            let activeVal = vals[j]
            if (data[activeUser] == activeVal) {
                filtData[activeUser] = {
                    'value': activeVal,
                    'position': j + 1
                }
            }
        }
    }
    return filtData
}


function podiumSort(data) {
    // Find the user with 2, then 1, then 3
    let sortOrder = [1, 2, 3]
    let sortedUsers = [], sortedValues = []
    let users = Object.keys(data)
    for (let i = 0; i < sortOrder.length; i++) {
        let activeOrder = sortOrder[i]
        for (let j = 0; j < users.length; j++) {
            let activeUser = users[j]
            if (data[activeUser]['position'] == activeOrder) {
                sortedUsers.push(activeUser)
                sortedValues.push(data[activeUser]['value'])
            }
        }
    }
    return [sortOrder, sortedValues, sortedUsers]
}


function gatherValuesInKey(obj, key) {
    let keys = Object.keys(obj)
    let returnValues = []
    for (let i = 0; i < keys.length; i++) {
        returnValues.push(obj[keys[i]][key])
    }
    return returnValues
}


function makePodium(xVal, yVal, names) {
    // let xVal = [2, 1, 3]
    // let yVal = gatherValuesInKey(totalPoints, 'value') //Object.values(totalPoints)
    // let names = gatherValuesInKey(totalPoints, 'user')
    positionMap = {
        1: '🥇',
        2: '🥈',
        3: '🥉'
    }

    var trace1 = {
        x: names,
        y: yVal,
        type: 'bar',
        text: yVal.map(String),
        textfont: {
            family: 'Titillium Web',
            size: 20
        },
        marker: {
            color: [
                'rgb(114, 153, 179)',
                'rgb(102, 201, 99)',
                'rgb(182, 130, 191)'
            ]
        }
    }

    var trace2 = {
        x: names,
        y: [yVal[0] + 10, yVal[1] + 10, yVal[2] + 10],
        mode: 'markers+text',
        type: 'scatter',
        text: xVal.map(function(val){return positionMap[val]}),
        textfont : {
            family:'Titillium Web',
            size: 30
          },
        textposition: 'above',
        marker: {
            size: 0,
            color: 'white'
         }
    }


    var data = [trace1, trace2]

    var layout = {
        yaxis: {
            visible: false
        },
        xaxis: {
            type: 'category',
            tickfont: {
                family: 'Roboto',
                size: 13,
                color: "#535351",
                weight: 1000
            }
        },
        showlegend: false,
        hovermode: false,
    }
    var config = {
        displayModeBar: false,
        responsive: true,
        staticPlot: true
    }

    const animationConfig = {
        transition: {
          duration: 500,
          easing: "cubic-in-out"
        },
        frame: {
          duration: 500
        }
      };

    Plotly.newPlot('chart-div', data, layout, config);    

}


function filterWhereUser(user, baseData) {
    let userRows = []
    for (let i = 0; i < baseData.length; i++) {
        let curRow = baseData[i]
        if (curRow['username'] === user) {
            userRows.push(curRow)
        }
    }
    return userRows
}


function findTopBottomSubmission(user, baseData) {
    // Filter base data for user, sort base data by datetime submission; find nth (1st or last) submission
    
    userRows = filterWhereUser(user, baseData)
    userRows.sort((a, b) => (
        a.time > b.time ? 1 : b.time > a.time ? -1: 0))

    return [userRows[0], userRows[userRows.length-1]]
}


function okDate(dateObj) {
    let day = dateObj.getDay(), month = dateObj.getMonth(), year = dateObj.getFullYear()
    return (month + 1) +'/' + (day + 1) + '/' + String(year).slice(2, 4)
}


function makePrettyUnitSubmission(row) {
    // For a row submitted, join time and unit
    return okDate(row['time']) + ': ' + row['units_completed']
}

function genTotalData(totalPoints, baseData) {
    // Takes in the total points and then creates a dataframe based on that object
    let users = Object.keys(totalPoints), points = Object.values(totalPoints);
    let newDF = []
    for (let i = 0; i < users.length; i++) {
        let curUser = users[i]
        let filtBase = filterWhereUser(curUser, baseData)
        userDF = {}
        userDF['username'] = curUser
        userDF['total_points'] = points[i]
        userDF['total_submissions'] = filtBase.length
        newDF.push(userDF)

        let topBottom = findTopBottomSubmission(curUser, baseData)
        let bottom = topBottom[0], top = topBottom[1]
        let firstSub = makePrettyUnitSubmission(bottom), lastSub = makePrettyUnitSubmission(top)
        userDF['first_submission'] = firstSub
        userDF['last_submission'] = ''
        if (firstSub != lastSub) {
            userDF['last_submission'] = lastSub
        }
    }
    return newDF
}

function genUserGallery(e, cell) {
    let galleryModalBG = document.getElementById('gallery-modal-bg')
    let user = cell._cell.initialValue
    console.log('you clicked: ', user)
    galleryModalBG.style.display = 'flex'
    galleryModalBG.innerHTML = '<div class="hmmm">BOW CHICKA BOW WOW</div>'
    galleryModalBG.addEventListener("click", function(e){
        console.log(e)
        e.target.style.display = "None"
    })
    
}

function genTable(data) {
    let table = new Tabulator('#table-div', {
      responsiveLayout: "hide",
      data:data,
      columns:[
        {title:'Name', field:'username', minWidth: 80,
            cellClick: function(e, cell) {
                genUserGallery(e, cell)
            }
        },
        {title:'Total Points', field:'total_points', sorter:'number', minWidth: 120},
        {title:'Total Submissions', field:'total_submissions', sorter:'number'},
        {title:'First Submission', field:'first_submission', maxWidth:200},
        {title:'Last Submission', field:'last_submission', maxWidth: 200},
        ],
        sorter:'number',
        initialSort:[
            {column:"total_points", dir:"desc", sorter:"number"}, //sort by this first
        ],
    })
  };