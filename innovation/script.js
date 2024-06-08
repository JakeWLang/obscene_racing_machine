var intros = ['Hi there,', 'Welcome', 'Hi', 'Howdy', 'Good morning,', 'Good afternoon,']
var names = ['Jake', 'Sowmya', 'Feliciti', 'Matthew', 'Cameron', 'Brad', 'Natalie']
var stops = ['...', '!', '?', '..!', '!?']

function randSel(arr) {
    const idx = Math.floor(Math.random() * arr.length)
    return arr[idx]
}

function changeText(id, text) {
    document.getElementById(id).innerHTML = text
}

function intro() {
    let welcome = randSel(intros) + ' ' + randSel(names) + randSel(stops)
    changeText('welcome', welcome)
}

intro()