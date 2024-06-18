let modal = document.getElementById('photobox');
let modalImg = document.getElementById('img01');
let closeSpan = document.getElementsByClassName('close')[0];
let captionText = document.getElementById('img-caption')

console.log(modalImg)
function selImg(d){
	// console.log(d)
	console.log(d.getAttribute('src'));
	modal.style.display = 'flex';

	if (d.getAttribute('src') == null) {
		modalImg.src = '/innovation/images/fake-discount.png'
	} else {
		modalImg.src = d.getAttribute('src');
	}
	modalImg.style.backgroundColor = 'white'
	captionText.innerHTML = d.getAttribute('alt')
}

closeSpan.onclick = function() {
	modal.style.display = 'none';
}

