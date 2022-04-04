let imgBox1 = document.getElementById('imgBox1')
let imgBox2 = document.getElementById('imgBox2')
let imgBox3 = document.getElementById('imgBox3')



let projBox1 = document.getElementById('projBox1')
let projBox2 = document.getElementById('projBox2')
let projBox3 = document.getElementById('projBox3')



projBox1.addEventListener('mouseover', d => {
	startImageTransition()
})

// projBox1.addEventListener('mouseout', d=> {
// 	stopImageTransition
// })







		function startImageTransition() {
			var images = document.getElementsByClassName("proj-imgs1");

			for (var i = 0; i < images.length; ++i) {
				images[i].style.opacity = 1;
			}

			var top = 1;

			var cur = images.length - 1;

			setInterval(changeImage, 3000);

			async function changeImage() {

				var nextImage = (1 + cur) % images.length;

				images[cur].style.zIndex = top + 1;
				images[nextImage].style.zIndex = top;

				await transition();

				images[cur].style.zIndex = top;

				images[nextImage].style.zIndex = top + 1;

				top = top + 1;

				images[cur].style.opacity = 1;
			
				cur = nextImage;

			}

			function transition() {
				return new Promise(function(resolve, reject) {
					var del = 0.01;

					var id = setInterval(changeOpacity, 10);

					function changeOpacity() {
						images[cur].style.opacity -= del;
						if (images[cur].style.opacity <= 0) {
							clearInterval(id);
							resolve();
						}
					}

				})
			}
		}