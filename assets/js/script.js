var commandsList = {
    "/teleport": 0,
    "/respawn": 0,
    "/nospawn": 0,
    "/spawnagain": 0,
    "/map": 0,
    "/loadmap": 0,
    "/export": 0,
    "/nm": 0,
    "/kill": 0
};
var commandsSend = [];

// /teleport 500 100

$(document).ready(function() {

    $("body").on("contextmenu", function() {
        return false;
    }); 

    $("#overlay").mousedown(function() {
        updateScreenGameState(1);
    }).mouseover(function() {
        if (!system.gameActive) updateScreenGameState(2);
    }).mouseleave(function() {
        if (!system.gameActive) updateScreenGameState(3);
    });

    $("#commands").mousedown(function() {
        system.gameActive = false;
        $("#overlay").css("background-color", "rgba(0,0,0,0.7)");
    });

    $("#commands").keydown(function(e) {
        if (e.which === 13) {
            sendCommand();
        }
    });

    $("#send").mouseup(function() {
        sendCommand();
    });

    $("#editor").mouseup(function() {
        if (!editor.isInside) {
            $(this).html("Quitter l'éditeur");
            goToEditor();
        } else {
            $(this).html("Éditeur de carte");
            exitEditor();
            nextMap();
        }
    });

    $("#playingMapState").mousedown(function() {
        if (editor.isInside) {
            let isEditing = ($(this).attr("data-state") === "true") ? true : false;
            editor.isEditing = isEditing;
            $(this).attr("data-state", !isEditing);
            updateCanSpawn(!isEditing);
            if (isEditing) {
                $(this).html("Jouer la carte");
                despawn();
            } else {
                $(this).html("Revenir à l'éditeur");
                selectGround(-1);
                selectData(-1);
                respawn();
            }
        }
    });

    $(".selectGround").mousedown(function () {
        if (editor.isInside && editor.isEditing) {
            let ref = parseInt($(this).attr("data-ref"));
            selectGround(ref, this);
            selectData(-1);
        }
    });

    $(".selectData").mousedown(function () {
        if (editor.isInside && editor.isEditing) {
            let ref = parseInt($(this).attr("data-ref"));
            selectData(ref, this);
            selectGround(-1);
        }
    });

    function updateScreenGameState(state)
    {
        switch (state) {
            case 1:
                system.gameActive = true;
                $("#overlay").css("background-color", "transparent");
                break;
            case 2:
                system.gameActive = false;
                $("#overlay").css("background-color", "rgba(0,0,0,0.3)");
                break;
            case 3:
                system.gameActive = false;
                $("#overlay").css("background-color", "rgba(0,0,0,0.7)");
                break;
        }
    }

    function sendCommand()
    {
        let input = $("#commands");
        let commandSend = input.val();
        input.blur();
        updateScreenGameState(1);

        if (commandSend != "") {
            input.val("");

            let args = commandSend.split(" ");
            let command = args[0];

            if (command in commandsList) {
                switch (command) {
                    case '/teleport':
                        if ($.isNumeric(args[1]) && $.isNumeric(args[2])) {
                            let x = parseInt(args[1]);
                            let y = parseInt(args[2]);
                            respawn(x, y);
                        }
                        break;
                    case '/respawn':
                        updateCanSpawn(true);
                        respawn();
                        break;
                    case '/nospawn':
                        updateCanSpawn(false);
                        break;
                    case '/spawnagain':
                        updateCanSpawn(true);
                        break;
                    case '/map':
                        if (!editor.isInside) {
                            if ($.isNumeric(args[1])) {
                                let code = parseInt(args[1]);
                                loadMap(code);
                            }
                        } else {
                            alert("Tu ne peux pas jouer une carte en éditeur. Pour la charger et la modifier, utilise la commande /loadmap [code].");
                        }
                        break;
                    case '/loadmap':
                        if ($.isNumeric(args[1])) {
                            let code = parseInt(args[1]);
                            loadMap(code);
                        }
                        break;
                    case '/export':
                        exportMap();
                        break;
                    case '/nm':
                        nextMap();
                        break;
                    case '/kill':
                        despawn();
                        break;
                }
            }
        }
    }

    nextMap();
    system.allIsLoaded = true;

}); 