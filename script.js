

const closeForm = () => {
	document.getElementById("popupForm").style.display = "none";
}


window.onclick = function(event) {
	let modal = document.getElementById('contact-form');
	if (event.target == modal) {
		closeForm();
	}
}