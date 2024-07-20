let modal = document.getElementById('photobox');
let modalImg = document.getElementById('img01');
let closeSpan = document.getElementsByClassName('close')[0];
let captionText = document.getElementById('img-caption')

console.log(modalImg)
function selImg(d){
	// console.log(d)
	console.log(d.getAttribute('src'));
	modal.style.display = 'flex';
	let src = ''
	if (d.getAttribute('id') == 'giftcard') {
		src = '/innovation/images/toy-train.png'
	}
	else if (d.getAttribute('id') == 'oneday') {
		src = '/innovation/images/fun_pass.jpg'
	}
	else if (d.getAttribute('id') == 'field') {
		src = '/innovation/images/sue.jpg'
	}
	else if (d.getAttribute('id') == 'raffle') {
		src = '/innovation/images/tickies.webp'
	}
	else if (d.getAttribute('id') == 'thirtyday') {
		src = '/innovation/images/30_day_pass.jpg'
	}
	else if (d.getAttribute('src') == null) {
		src = '/innovation/images/fake-discount.png'
	} else {
		src = d.getAttribute('src');
	}
	modalImg.src = src
	modalImg.style.backgroundColor = 'white'
	captionText.innerHTML = d.getAttribute('alt')
}

closeSpan.onclick = function() {
	modal.style.display = 'none';
}

