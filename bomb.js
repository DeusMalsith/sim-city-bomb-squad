document.addEventListener('DOMContentLoaded', function() {
	console.log("DOM got loaded");
});

var time, interval, siren;

document.getElementById('startGame').addEventListener('click', start);

function start(){
	addWireListeners();
	clearInterval(interval);

	time = 30;
	document.getElementById('timer').textContent = time;


	interval = setInterval(tick, 1000);

	this.textContent = "Try Again!";

	document.getElementsByTagName('body')[0].classList.add('unexploded');
	document.getElementsByTagName('body')[0].classList.remove('exploded');

	document.getElementById('message').textContent = "";
	document.getElementById('timer').style.color = 'chartreuse';

	siren = document.getElementById('siren');
	siren.play();
}

function tick() {
	console.log("Tick", time);
	time -= 1;
	document.getElementById('timer').textContent = time;

	if(time <= 3){
		document.getElementById('timer').style.color = 'red';
	}

	if(time <=0){
		loseGame();
	}
}

function addWireListeners() {
	var wireImages = document.querySelectorAll('#box img');

	for(var i=0; i < wireImages.length; i++) {
		wireImages[i].src = './img/uncut-' + wireImages[i].id + '-wire.png';
		wireImages[i].setAttribute('data-cut', (Math.random() > 0.5).toString());
		console.log(wireImages[i]);
		wireImages[i].addEventListener('click', clickWire);
	}
	if(checkWin()){
		start();
	}

}

function removeWireListeners() {
	var wireImages = document.querySelectorAll('#box img');

	for(var i=0; i < wireImages.length; i++) {
		wireImages[i].removeEventListener('click', clickWire);
	}
}

function clickWire() {
	console.log("Wire clicked", this.id);
	this.src = './img/cut-' + this.id + '-wire.png';
	this.removeEventListener('click', clickWire);

	if(this.getAttribute('data-cut') === 'true') {
		console.log("YAY!");
		this.setAttribute('data-cut', 'false');
		document.getElementById('buzz').play();

		if(checkWin()) {
			console.log("I WIN!");
			winGame();
		}
		else {
			console.log("Keep trying");
		}
	}
	else {
		console.log("BOOOOOOM!");
		loseGame();
	}
}

function checkWin(){
		var wireImages = document.querySelectorAll('#box img');

	for(var i=0; i < wireImages.length; i++) {
		if(wireImages[i].getAttribute('data-cut') === 'true') {
			return false;
		}
	}
	return true;	
}

function stopGame(message) {
	clearInterval(interval);

	removeWireListeners();

	siren.pause();

	document.getElementById('message').textContent = message;
}

function winGame() {
	stopGame("YAY, YOU SAVED US!");

	var cheer = document.getElementById('cheer');
	cheer.addEventListener('ended',function() {
		document.getElementById('success').play();
	});
	cheer.play();
}

function loseGame() {
	stopGame();

	document.getElementsByTagName('body')[0].classList.remove('unexploded');
	document.getElementsByTagName('body')[0].classList.add('exploded');

	var explodeSound = document.getElementById('explode');
	explodeSound.play();

	stopGame("You've doomed us all");
}