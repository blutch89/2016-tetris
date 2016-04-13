var tetris = {
    container: $("#container"),
    gameContainer: $("#game-container"),
    gameInfo: $("#game-info"),
    gameCells: undefined,
    gameWidth: 10,
    gameHeight: 18,
    cellSize: 30,
    isInPauseMode: false,
    isStarted: false,
    isEnded: false,

    // Initialise le jeu
    initGame: function () {
    	tetris.initDimensions();

        // Création des cellules
        for (y = 0; y < tetris.gameHeight; y++) {
            for (x = 0; x < tetris.gameWidth; x++) {
                tetris.gameContainer.append("<div class='cell' x='" + x + "' y='" + y + "'></div>");
            }
        }

        tetris.gameContainer.append("<div class='clearfix'></div>");

        // Style pour les cellules
        tetris.gameCells = $(".cell");
        tetris.gameCells.each(function () {
            $(this).css("width", tetris.cellSize + "px");
            $(this).css("height", tetris.cellSize + "px");
        });

        // Création de la zone de la prochaine forme
        tetris.initNextShapeArea();

        // Init le jeu
        tetris.shapes.currentShape = tetris.shapes.getRandomShape();
        tetris.shapes.nextShape = tetris.shapes.getRandomShape();
        tetris.shapes.initShapesCoord();
        tetris.shapes.drawShape();
        tetris.shapes.drawNextShape();
    },

    // Calcul les différentes dimensions
    initDimensions: function() {
        var gameWidthPx = $("#game-container").width() - 1; // J'ai mis "-1" parce que le width du container peut être 200.12, 200.87 et il ne peut avoir de demi pixels. Règle donc des problèmes de dimensionnements
        tetris.cellSize = gameWidthPx / tetris.gameWidth;
    },

    // Initialise la zone de la prochaine forme
    initNextShapeArea: function () {
        var gameNext = $("#game-next");
        var nextCellSize = (gameNext.width() - 1) / 3 * 50 / 100;

        // Création des cellules
        for (var y = 0; y < 4; y++) {
            for (var x = 0; x < 3; x++) {
                gameNext.append("<div class='next-cell' x='" + x + "' y='" + y + "' style='width: " + nextCellSize + "px; height: " + nextCellSize + "px;'></div>");
            }
        }

        gameNext.append("<div class='clearfix'></div>");
        gameNext.css("width", nextCellSize * 3 + "px");
    },

    // Relance le jeu
    resetGame: function() {
        tetris.gameContainer.empty();
        $("#game-score").text(0);
        $("#game-level").text(0);
        $("#game-nb-lines").text(0);
        $("#game-next").empty();
        tetris.message.deleteMessage();
        tetris.initGame();
    },

    // Met le jeu en pause
    pauseMode: function () {
        if (tetris.isInPauseMode) {
            tetris.message.deleteMessage();
            tetris.isInPauseMode = false;
        } else {
            tetris.message.displayMessage("Pause");
            tetris.isInPauseMode = true;
        }
    },

    // Appelée quand le jeu est perdu
    lostGame: function () {
        tetris.isEnded = true;
        tetris.sounds.start(tetris.sounds.GAMEOVER);
        tetris.message.displayMessage("Game Over :(");
    },

    shapes: {
        shapesList: ["n1", "n2", "t", "l1", "l2", "line", "square"],
        shapesCoord: new Array(),
        originCell: {x: 4, y: 0},
        currentShape: "",
        currentPosition: 0,
        nextShape: "",

        // Initialise le tableau de coordonnées de toutes les formes
        initShapesCoord: function () {
            tetris.shapes.shapesCoord["n1"] = [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: 1, y: 2}
                ],

                [
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: 1, y: 0},
                    {x: 2, y: 0}
                ]
            ];

            tetris.shapes.shapesCoord["n2"] = [
                [
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 0, y: 1},
                    {x: 0, y: 2}
                ],

                [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 2, y: 1}
                ]
            ];

            tetris.shapes.shapesCoord["t"] = [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: 1, y: 1}
                ],

                [
                    {x: 0, y: 0},
                    {x: -1, y: 0},
                    {x: 1, y: 0},
                    {x: 0, y: 1}
                ],

                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: -1, y: 1}
                ],

                [
                    {x: 0, y: 0},
                    {x: -1, y: 1},
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ]
            ];

            tetris.shapes.shapesCoord["l1"] = [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: 1, y: 2}
                ],

                [
                    {x: -1, y: 1},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: 1, y: 0}
                ],

                [
                    {x: -1, y: 0},
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2}
                ],

                [
                    {x: -1, y: 2},
                    {x: -1, y: 1},
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ]
            ];

            tetris.shapes.shapesCoord["l2"] = [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: -1, y: 2}
                ],

                [
                    {x: -1, y: 1},
                    {x: 0, y: 1},
                    {x: 1, y: 1},
                    {x: -1, y: 0}
                ],

                [
                    {x: 1, y: 0},
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2}
                ],

                [
                    {x: 1, y: 2},
                    {x: -1, y: 1},
                    {x: 0, y: 1},
                    {x: 1, y: 1}
                ]
            ];

            tetris.shapes.shapesCoord["line"] = [
                [
                    {x: 0, y: 0},
                    {x: 0, y: 1},
                    {x: 0, y: 2},
                    {x: 0, y: 3}
                ],

                [
                    {x: -1, y: 0},
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 2, y: 0}
                ]
            ];

            tetris.shapes.shapesCoord["square"] = [
                [
                    {x: 0, y: 0},
                    {x: 1, y: 0},
                    {x: 1, y: 1},
                    {x: 0, y: 1}
                ]
            ];
        },

        // Dessine la forme
        drawShape: function () {
            var originX = tetris.shapes.originCell.x;
            var originY = tetris.shapes.originCell.y;
            var position = tetris.shapes.currentPosition % tetris.shapes.shapesCoord[tetris.shapes.currentShape].length;
            var originCellsCoord = tetris.shapes.shapesCoord[tetris.shapes.currentShape][position];
            var newCellsCoord = [];

            // Calcul des nouvelles coordonnées
            for (var index in originCellsCoord) {
                newCellsCoord.push({x: originCellsCoord[index].x + originX, y: originCellsCoord[index].y + originY});
            }

            // Dessine la forme
            if (tetris.shapes.isCellValid(newCellsCoord)) {
                for (var index in newCellsCoord) {
                    var currentCell = tetris.shapes.getCell(newCellsCoord[index].x, newCellsCoord[index].y);
                    currentCell.attr("current", "true");
                    currentCell.addClass("shape-" + tetris.shapes.currentShape);
                }
                ;
            } else {
                tetris.lostGame();
            }
        },

        // Dessine la forme dans la zone de la prochaine forme
        drawNextShape: function () {
            var position = tetris.shapes.currentPosition % tetris.shapes.shapesCoord[tetris.shapes.nextShape].length;
            var originCellsCoord = tetris.shapes.shapesCoord[tetris.shapes.nextShape][position];

            tetris.shapes.eraseNextShape();

            for (var index in originCellsCoord) {
                var currentCell = tetris.shapes.getNextCell(originCellsCoord[index].x + 1, originCellsCoord[index].y);
                currentCell.addClass("shape-" + tetris.shapes.nextShape);
            }
            ;
        },

        // Efface la forme
        eraseCurrentShape: function () {
            $(".cell[current=true]").each(function () {
                $(this).removeAttr("current");
                $(this).removeClass();
                $(this).addClass("cell");
            });
        },

        // Efface la forme dans la zone de la prochaine forme
        eraseNextShape: function () {
            $(".next-cell").each(function () {
                $(this).removeClass();
                $(this).addClass("next-cell");
            });
        },

        // Déplace la forme
        moveCurrentShape: function (x, y) {
            if (tetris.isEnded) {
                return;
            }

            // Si la forme se déplace horizontalement
            if (x != 0 && y == 0) {
                tetris.sounds.start(tetris.sounds.MOVE);
            }

            var originCellsCoord = tetris.shapes.shapesCoord[tetris.shapes.currentShape][tetris.shapes.currentPosition % tetris.shapes.shapesCoord[tetris.shapes.currentShape].length];
            var newCellsCoord = [];

            // Calcul les nouvelles coordonnées
            for (var index in originCellsCoord) {
                var newX = tetris.shapes.originCell.x + originCellsCoord[index].x + x;
                var newY = tetris.shapes.originCell.y + originCellsCoord[index].y + y;

                newCellsCoord.push({x: newX, y: newY});
            }

            if (tetris.shapes.isCellValid(newCellsCoord)) {		// Si le mouvement est possible(valid)
                tetris.shapes.eraseCurrentShape();

                for (var index in newCellsCoord) {
                    var newCell = $(".cell[x=" + newCellsCoord[index].x + "][y=" + newCellsCoord[index].y + "]");
                    newCell.attr("current", "true");
                    newCell.addClass("shape-" + tetris.shapes.currentShape);
                }

                tetris.shapes.originCell = {x: tetris.shapes.originCell.x + x, y: tetris.shapes.originCell.y + y};
            } else {											// S'il ne l'est pas
                if (x == 0 && y == 1) {							// Si la direction est le bas et donc si la forme est posée sur le sol, relance une nouvelle forme
                    tetris.shapes.shapePut();
                }
            }
        },

        // Est-ce que les coordonnées en paramètres ne touchent aucune autre forme ou bord de la zone de jeu
        isCellValid: function (cellsCoord) {
            var isValid = true;

            for (var index in cellsCoord) {
                var x = cellsCoord[index].x;
                var y = cellsCoord[index].y;

                if (x < 0 || x > tetris.gameWidth - 1 || y > tetris.gameHeight - 1) {	// Test si la cellule sort du tableau ou non
                    isValid = false;
                } else {
                    var cell = tetris.shapes.getCell(x, y);

                    if (cell.attr("class").match(/shape-n1|shape-n2|shape-t|shape-l1|shape-l2|shape-square|shape-line/) && cell.attr("current") != "true") {	// Test si la cellule ne contient pas déjà une pièce
                        isValid = false;
                    }
                }
            }

            return isValid;
        },

        // Fonction appelée quand la forme s'est posée
        shapePut: function () {
            tetris.shapes.currentShape = tetris.shapes.nextShape;
            tetris.shapes.nextShape = tetris.shapes.getRandomShape();
            tetris.shapes.originCell = {x: 4, y: 0};
            tetris.shapes.currentPosition = 0;
            $(".cell[current=true]").removeAttr("current");

            tetris.sounds.start(tetris.sounds.DROP);

            // Gère les lignes
            var lines = tetris.lines.checkFullLines();
            if (lines.length > 0) {
                tetris.lines.eraseLines(lines);
                tetris.score.displayGameInfo(tetris.score.calculateScore(lines.length), lines.length);
            }

            // Dessine la nouvelle forme
            tetris.shapes.drawShape();

            // Dessine la prochaine forme
            tetris.shapes.drawNextShape();
        },

        // Touche la forme
        rotateCurrentShape: function () {
            tetris.sounds.start(tetris.sounds.ROTATE);

            var originCellsCoord = tetris.shapes.shapesCoord[tetris.shapes.currentShape][(tetris.shapes.currentPosition + 1) % tetris.shapes.shapesCoord[tetris.shapes.currentShape].length];
            var newCellsCoord = [];

            // Calcul les nouvelles coordonnées de la forme tournée
            for (var index in originCellsCoord) {
                var newX = tetris.shapes.originCell.x + originCellsCoord[index].x;
                var newY = tetris.shapes.originCell.y + originCellsCoord[index].y;

                newCellsCoord.push({x: newX, y: newY});
            }

            if (tetris.shapes.isCellValid(newCellsCoord)) {
                tetris.shapes.eraseCurrentShape();
                tetris.shapes.currentPosition += 1;
                tetris.shapes.drawShape();
            }
        },

        // Retourne une forme au hasard
        getRandomShape: function () {
            var randomNumber = Math.floor(Math.random() * tetris.shapes.shapesList.length);

            return tetris.shapes.shapesList[randomNumber];
        },

        // Retourne la forme en fonction des coordonnées
        getCell: function (x, y) {
            return $(".cell[x=" + x + "][y=" + y + "]");
        },

        // Retourne la forme (next forme) en fonction des coordonnées
        getNextCell: function (x, y) {
            return $(".next-cell[x=" + x + "][y=" + y + "]");
        }
    },

    lines: {
        // Test combien de lignes sont remplies
        checkFullLines: function () {
            var lines = [];

            for (var y = 0; y < tetris.gameHeight; y++) {
                var isFull = true;

                for (var x = 0; x < tetris.gameWidth; x++) {
                    var cell = tetris.shapes.getCell(x, y);

                    if (!$(cell).attr("class").match(/shape-n1|shape-n2|shape-t|shape-l1|shape-l2|shape-square|shape-line/)) {
                        isFull = false;
                    }
                }

                if (isFull) {
                    lines.push(y);
                }
            }

            return lines;
        },

        // Efface les lignes spécifiées en paramètre
        eraseLines: function (lines) {
            // Joue le son d'effacement de ligne
            if (lines.length == 4) {
                tetris.sounds.start(tetris.sounds.FOUR_LINE);
            } else {
                tetris.sounds.start(tetris.sounds.LINE);
            }

            // Crée un tableau de cellules à supprimer
            var cellsToRemove = $(".cell").filter(function() {
                var y = parseInt($(this).attr("y"));
                return ($.inArray(y, lines) > -1);
            });

            // Supprime et anime la suppression de lignes
            var it = 0;
            cellsToRemove
                    .fadeOut(150)
                    .fadeIn(150)
                    .fadeOut(150)
                    .fadeIn(150)
                    .fadeOut(150, function() {
                        it++;

                        // Supprime la cellules
                        $(this).remove();

                        // Ajoute une nouvelle cellule par cellule supprimée
                        tetris.gameContainer.prepend("<div class='cell' x='0' y='0' style='width: " + tetris.cellSize + "px; height: " + tetris.cellSize + "px;'></div>");

                        // Dès que toutes les animations se sont lancées
                        if (it == cellsToRemove.length) {
                            // Réattribue les coordonnées aux différentes cellules
                            var i = 0;
                            tetris.gameCells = $(".cell");
                            tetris.gameCells.each(function () {
                                $(this).attr("x", i % tetris.gameWidth);
                                $(this).attr("y", Math.floor(i / tetris.gameWidth));

                                i++;
                            });
                        }
                    });
        }
    },

    score: {
        // Calcul le score en fonction du nombre de lignes remplies
        calculateScore: function (nbLines) {
            var score = 0;

            if (nbLines == 1) {
                score = 100;
            } else if (nbLines == 2) {
                score = 300;
            } else if (nbLines == 3) {
                score = 700;
            } else if (nbLines == 4) {
                score = 1500;
            }

            return score;
        },

        // Affiche les informations de jeu en fonction des paramètres
        displayGameInfo: function (score, nbLines) {
            var gameScore = $("#game-score");
            var gameLevel = $("#game-level");
            var gameNbLines = $("#game-nb-lines");
            var score = parseInt(gameScore.text()) + score;
            var level = Math.floor(score / 1000);
            var nbLines = parseInt(gameNbLines.text()) + nbLines;

            gameScore.text(score);
            gameLevel.text(level);
            gameNbLines.text(nbLines);

            tetris.score.changeDifficulty(level);
        },

        // Effectue le changement de difficulté en fonction du level en paramètre
        changeDifficulty: function(level) {
            if (level <= 8) {
                tetris.timer.intervalTime = 1000 - (level * 120);
            } else {
                tetris.timer.intervalTime = 150;
            }

            tetris.timer.stopTimer();
            tetris.timer.startTimer();
        }
    },

    timer: {
        moveInterval: undefined,
        intervalTime: 1000,

        // Démarre le timer de déplacement de forme
        startTimer: function () {
            tetris.timer.moveInterval = setInterval(function () {
                tetris.shapes.moveCurrentShape(0, 1);
            }, tetris.timer.intervalTime);
        },

        // Stop le timer de déplacement de forme
        stopTimer: function () {
            clearInterval(tetris.timer.moveInterval);
        }
    },

    message: {
        // Met en pause le jeu et affiche un message sur la zone de jeu
        displayMessage: function(message) {
            tetris.timer.stopTimer();

            var gameWidthPx = tetris.gameContainer.width();
            var gameHeightPx = tetris.gameContainer.height();
            var gamePositionX = tetris.gameContainer.position().left;
            var gamePositionY = tetris.gameContainer.position().top;
            $(document.body).prepend("<div id='stop-message'><div id='stop-message-text'>" + message + "</div></div>");
            var stopMessage = $("#stop-message");
            stopMessage.css("top", gamePositionY + "px");
            stopMessage.css("left", gamePositionX + "px");
            stopMessage.css("width", gameWidthPx + "px");
            stopMessage.css("height", gameHeightPx + "px");

            tetris.sounds.pause(tetris.sounds.BACKGROUND);
        },

        // Supprime le message et relance le jeu
        deleteMessage: function() {
            tetris.timer.startTimer();

            $("#stop-message").remove();

            tetris.sounds.start(tetris.sounds.BACKGROUND);
        }
    },

    sounds: {
        BACKGROUND: "m-background",
        DROP: "m-drop",
        GAMEOVER: "m-gameover",
        LINE: "m-line",
        MOVE: "m-move",
        ROTATE: "m-rotate",
        FOUR_LINE: "m-4-lines",

        // Joue le son en paramètre (id de la balise audio)
        start: function(soundId) {
            tetris.sounds.stopAll();
            $("#" + soundId)[0].play();
        },

        // Met en pause le son en paramètre (id de la balise audio)
        pause: function(soundId) {
            $("#" + soundId)[0].pause();
        },

        // Stop tous les sons excepté la musique de fond
        stopAll: function(){
            $("audio:not('#m-background')").trigger('pause');
            $("audio:not('#m-background')").prop("currentTime",0);
        }
    }
}

