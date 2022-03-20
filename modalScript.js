let modal = document.getElementById('photobox');
let modalImg = document.getElementById('img01');
let closeSpan = document.getElementsByClassName('close')[0];
let captionText = document.getElementById('img-caption')



function selImg(d){
	// console.log(d)
	console.log(d.getAttribute('src'));
	modal.style.display = 'block';
	modalImg.src = d.getAttribute('src');
	modalImg.style.backgroundColor = 'white'
	captionText.innerHTML = d.getAttribute('alt')
}

closeSpan.onclick = function() {
	modal.style.display = 'none';
}

