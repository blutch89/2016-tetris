$(function() {
	function playPause() {
		if (!tetris.isStarted) {				// Si le jeu n'est pas encore démarré
			tetris.isStarted = true;
			tetris.message.deleteMessage();
		} else if(tetris.isEnded) {				// Si le jeu est terminé
			tetris.isEnded = false;
			tetris.resetGame();
		} else {								// Si c'est une simple pause de jeu
			tetris.pauseMode();
		}
	};

	// Evènements
	$(document).on("keydown", function(event) {
		if (event.which == 38) {		// Si "Haut" -> tourner
			tetris.shapes.rotateCurrentShape();
		} else if (event.which == 37) {	// Si "Gauche" -> déplace à gauche
			tetris.shapes.moveCurrentShape(-1, 0);
		} else if (event.which == 39) {	// Si "Droite" -> déplace à droite
			tetris.shapes.moveCurrentShape(1, 0);
		} else if (event.which == 40) {	// Si "Bas" -> accélère la descente de la forme
			tetris.shapes.moveCurrentShape(0, 1);
		} else if (event.which == 13) {	// Si "Enter" -> met en pause le jeu
			playPause();
		}
	});

	// Touche sur le bouton gauche
	$("#m-left").on("click", function() {
		tetris.shapes.moveCurrentShape(-1, 0);
	});

	// Touche sur le bouton haut
	$("#m-up").on("click", function() {
		tetris.shapes.rotateCurrentShape();
	});

	// Touche sur le bouton bas
	$("#m-down").on("click", function() {
		event.preventDefault();
		tetris.shapes.moveCurrentShape(0, 1);
	});

	// Touche sur le bouton droite
	$("#m-right").on("click", function() {
		tetris.shapes.moveCurrentShape(1, 0);
	});

	// Touche sur le bouton droite
	$("#m-play").on("click", function() {
		playPause();
	});
	
	tetris.initGame();
	tetris.message.displayMessage("Presser entrer");
	
});