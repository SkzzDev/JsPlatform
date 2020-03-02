var system = {
    'gameActive': true,
    'background': '#202020',
    'swidth': 1000,
    'sheight': 600,
    'frameRate': 60,
    'gravity': 0.18,
    'jumpForce': 4,
    'moveSpeed': {
        'ground': 0.42,
        'air': 0.2
    },
    'maxSpeed': 1.8,
    'airDeceleration': 1.05,
    'currentMapCode': -2,
    'allIsLoaded': false,
    'mapTime': {
        'now': 0,
        'start': Date.now()
    }
};
var editor = {
    'isInside': false,
    'isEditing': true,
    'newGround': {
        'canBeCreated': false,
        'state': false,
        'gType': 0,
        'x1': 0,
        'x2': 0,
        'y1': 0,
        'y2': 0
    },
    'newData': {
        'canBeCreated': false,
        'dType': 0,
        'x': 0,
        'y': 0
    }
}
var keys = {'up': false, 'right': false, 'left': false};
var groundsType = [
    { // Bois
        'friction': 0.1,
        'restitution': 0.2,
        'color1': '#B78D74'
    },
    { // Chocolat
        'friction': 0.8,
        'restitution': 0.2,
        'color1': '#715645'
    },
    { // Glace
        'friction': 0.008,
        'restitution': 0.2,
        'color1': '#B4D7E5'
    },
    { // Trampoline
        'friction': 0.1,
        'restitution': 1.15,
        'color1': '#AC58FA'
    }
];
var dataType = [
    { // Spawn
        'color1': "#FF0000",
        'w': 10,
        'h': 10
    },
    { // Hole
        'color1': "#008000",
        'w': 10,
        'h': 10
    },
    { // Checkpoints
        'color1': "#0174DF",
        'color2': "#F4DA16",
        'w': 10,
        'h': 10
    }
];
var mapList = [1,4,5];
var currentMap = {
    'mdata': {
        'spawn': {},
        'holes': [],
        'checkpoints': []
    },
    'grounds': []
};
var player = {
    'bSize': 20,
    'x': 0,
    'y': 0,
    'px': 0,
    'py': 0,
    'vx': 0,
    'vy': 0,
    'pvx': 0,
    'pvy': 0,
    'otg': true,
    'collision': {
        'state': true,
        'ground': 0
    },
    'canSpawn': true,
    'spawned': true,
    'scheckpoints': {
        'left': 0,
        'list': []
    },
    'color1': '#FE642E'
};

var timex = 0, timey = 0, fRate = 0;

function verifGroundsCollisions() {
    if (currentMap.grounds.length > 0) {
        // Verif collisions
        for (let ig = 0; ig < currentMap.grounds.length; ig++) {
            if (player.x + player.bSize + 1 >= currentMap.grounds[ig].x && player.x - 1 <= currentMap.grounds[ig].x + currentMap.grounds[ig].w) {
                if (player.y + player.bSize + 1 >= currentMap.grounds[ig].y && player.y - 1 <= currentMap.grounds[ig].y + currentMap.grounds[ig].h) {

                    player.collision.state = true;
                    player.collision.ground = ig;

                    if (player.px + player.bSize < currentMap.grounds[ig].x) { // Gauche
                        
                        timex = abs(currentMap.grounds[ig].x - (player.px + player.bSize + 1)) / abs(player.pvx);

                        if (player.py + player.bSize < currentMap.grounds[ig].y) { // Haut
                            timey = abs(currentMap.grounds[ig].x - (player.py + player.bSize + 1)) / abs(player.pvy);
                            if (timex < timey) {
                                player.vy = -player.vy * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.y = currentMap.grounds[ig].y - player.bSize - 1;
                                player.otg = true;
                                player.canJump = true;
                            } else {
                                player.vx = -player.vx * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.x = currentMap.grounds[ig].x - player.bSize - 1;
                            }
                        } else if (player.py > currentMap.grounds[ig].y + currentMap.grounds[ig].h) { // Bas
                            timey = abs((currentMap.grounds[ig].x + currentMap.grounds[ig].w) - player.py) / abs(player.pvy);
                            if (timex < timey) {
                                player.vy = -player.vy * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.y = currentMap.grounds[ig].y + currentMap.grounds[ig].h + 1;
                            } else {
                                player.vx = -player.vx * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.x = currentMap.grounds[ig].x - player.bSize - 1;
                            }
                        } else { // self était déjà compris dans l'interval y
                            player.vx = -player.vx * groundsType[currentMap.grounds[ig].gType].restitution;
                            player.x = currentMap.grounds[ig].x - player.bSize - 1;
                        }
                    } else if (player.px > currentMap.grounds[ig].x + currentMap.grounds[ig].w) { // Droite
                        
                        timex = abs((currentMap.grounds[ig].x + currentMap.grounds[ig].w) - player.px + 1) / abs(player.pvx);

                        if (player.py + player.bSize < currentMap.grounds[ig].y) { // Haut
                            timey = abs(currentMap.grounds[ig].x - (player.py + player.bSize + 1)) / abs(player.pvy);

                            if (timex < timey) {
                                player.vy = -player.vy * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.y = currentMap.grounds[ig].y - player.bSize - 1;
                                player.otg = true;
                                player.canJump = true;
                            } else {
                                player.vx = -player.vx * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.x = currentMap.grounds[ig].x + currentMap.grounds[ig].w + 1;
                            }
                        } else if (player.py > currentMap.grounds[ig].y + currentMap.grounds[ig].h) { // Bas
                            timey = abs((currentMap.grounds[ig].x + currentMap.grounds[ig].w) - player.py) / abs(player.pvy);
                            if (timex < timey) {
                                player.vy = -player.vy * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.y = currentMap.grounds[ig].y + currentMap.grounds[ig].h + 1;
                            } else {
                                player.vx = -player.vx * groundsType[currentMap.grounds[ig].gType].restitution;
                                player.x = currentMap.grounds[ig].x + currentMap.grounds[ig].w + 1;
                            }
                        } else {
                            player.vx = -player.vx * groundsType[currentMap.grounds[ig].gType].restitution;
                            player.x = currentMap.grounds[ig].x + currentMap.grounds[ig].w + 1;
                        }
                    } else { // player.px déjà dans l'interval
                        player.vy = -player.vy * groundsType[currentMap.grounds[ig].gType].restitution;
                        if (player.py + player.bSize < currentMap.grounds[ig].y) {
                            player.y = currentMap.grounds[ig].y - player.bSize - 1;
                            player.otg = true;
                            player.canJump = true;
                        } else {
                            player.y = currentMap.grounds[ig].y + currentMap.grounds[ig].h + 1;
                        }
                    }

                }
            }
        }
    }
}

function verifHolesCollisions() {
    if (currentMap.mdata.holes.length > 0) {
        if (player.scheckpoints.left == 0) { // Si self a prit tous les checkpoints
            for (let ih = 0; ih < currentMap.mdata.holes.length; ih++) {
                if (player.x + player.bSize + 1 >= currentMap.mdata.holes[ih].x && player.x - 1 <= currentMap.mdata.holes[ih].x + dataType[1].w) {
                    if (player.y + player.bSize + 1 >= currentMap.mdata.holes[ih].y && player.y - 1 <= currentMap.mdata.holes[ih].y + dataType[1].w) {
                        nextMap();
                    }
                }
            }
        }
    }
}

function verifCheckpointsCollisions() {
    if (currentMap.mdata.checkpoints.length > 0) {
        if (player.scheckpoints.left > 0) { // S'il reste des checkpoints à vérifier
            for (let ic = 0; ic < currentMap.mdata.checkpoints.length; ic++) {
                if (player.scheckpoints.list[ic] === false) { // Si ce checkpoint n'a pas encore été pris
                    if (player.x + player.bSize + 1 >= currentMap.mdata.checkpoints[ic].x && player.x - 1 <= currentMap.mdata.checkpoints[ic].x + dataType[2].w) {
                        if (player.y + player.bSize + 1 >= currentMap.mdata.checkpoints[ic].y && player.y - 1 <= currentMap.mdata.checkpoints[ic].y + dataType[2].w) {
                            player.scheckpoints.list[ic] = true;
                            player.scheckpoints.left--;
                        }
                    }
                }
            }
        }
    }
}

function setCheckpoints() {
    player.scheckpoints.left = currentMap.mdata.checkpoints.length;
    if (currentMap.mdata.checkpoints.length > 0) {
        for (let ic = 0; ic < currentMap.mdata.checkpoints.length; ic++) {
            player.scheckpoints.list[ic] = false;
        }
    }
}

function keyPressed() {
    setMove(keyCode, true);
}

function keyReleased() {
    setMove(keyCode, false);
}

function mousePressed() {
    if (editor.isInside && editor.isEditing) {
        if (!system.gameActive) {
            editor.newGround.state = false;
        } else if (mouseButton === LEFT) {
            if (mouseX >= 0 && mouseX <= system.swidth && mouseY >= 0 && mouseY <= system.sheight) {
                if (editor.newGround.canBeCreated) {
                    if (editor.newGround.state) {
                        editor.newGround.state = false;
                        editor.newGround.x2 = mouseX;
                        editor.newGround.y2 = mouseY;

                        // Si le sol est tracé de la droite vers la gauche, on inverse les données
                        if (abs(editor.newGround.x1 - editor.newGround.x2) >= 10 && abs(editor.newGround.y1 - editor.newGround.y2) >= 10) {
                            var temp;
                            if (editor.newGround.x1 > editor.newGround.x2) {
                                temp = editor.newGround.x1;
                                editor.newGround.x1 = editor.newGround.x2;
                                editor.newGround.x2 = temp;
                            }
                            if (editor.newGround.y1 > editor.newGround.y2) {
                                temp = editor.newGround.y1;
                                editor.newGround.y1 = editor.newGround.y2;
                                editor.newGround.y2 = temp;
                            }
                            append(currentMap.grounds, {
                                'x': editor.newGround.x1,
                                'y': editor.newGround.y1,
                                'w': editor.newGround.x2 - editor.newGround.x1,
                                'h': editor.newGround.y2 - editor.newGround.y1,
                                'gType': editor.newGround.gType
                            });
                        }
                    } else {
                        if (currentMap.grounds.length < 50) {
                            editor.newGround.state = true;
                            editor.newGround.x1 = mouseX;
                            editor.newGround.y1 = mouseY;
                        } else {
                            alert("Tu ne peux pas créer plus de 50 sols sur ta carte.");
                        }
                    }
                } else if (editor.newData.canBeCreated) {

                    switch (editor.newData.dType) {
                        case 0: // Spawn
                            currentMap.mdata.spawn.x = mouseX - (dataType[0].w/2);
                            currentMap.mdata.spawn.y = mouseY - (dataType[0].w/2);
                            break;
                        case 1: // Trous
                            append(currentMap.mdata.holes, {
                                'x': mouseX - (dataType[1].w/2),
                                'y': mouseY - (dataType[1].w/2),
                            });
                            break;
                        case 2: // Checkpoints
                            player.scheckpoints.list[currentMap.mdata.checkpoints.length] = false;
                            player.scheckpoints.left++;
                            append(currentMap.mdata.checkpoints, {
                                'x': mouseX - (dataType[2].w/2),
                                'y': mouseY - (dataType[2].w/2),
                            });
                            break;
                    }
                }
            } else {
                editor.newGround.state = false;
            }
        } else if (mouseButton === RIGHT) {
            if (editor.newGround.state) {
                editor.newGround.state = false;
            } else {

                let smthDisepear = false;

                // Retirer un trou
                for (let h = 0; h < currentMap.mdata.holes.length; h++) {
                    let hole = currentMap.mdata.holes[h];
                    if (mouseX >= hole.x && mouseX < hole.x + dataType[1].w) {
                        if (mouseY >= hole.y && mouseY < hole.y + dataType[1].h) {
                            for (let h2 = h; h2 < currentMap.mdata.holes.length - 1; h2++) {
                                currentMap.mdata.holes[h2] = currentMap.mdata.holes[h2 + 1];
                            }
                            currentMap.mdata.holes.pop();
                            smthDisepear = true;
                            break;
                        }
                    }
                }

                if (!smthDisepear) {
                    // Retirer un checkpoint
                    for (let c = 0; c < currentMap.mdata.checkpoints.length; c++) {
                        let checkpoint = currentMap.mdata.checkpoints[c];
                        if (mouseX >= checkpoint.x && mouseX < checkpoint.x + dataType[1].w) {
                            if (mouseY >= checkpoint.y && mouseY < checkpoint.y + dataType[1].h) {
                                for (let c2 = c; c2 < currentMap.mdata.checkpoints.length - 1; c2++) {
                                    currentMap.mdata.checkpoints[c2] = currentMap.mdata.checkpoints[c2 + 1];
                                }
                                currentMap.mdata.checkpoints.pop();
                                setCheckpoints();
                                smthDisepear = true;
                                break;
                            }
                        }
                    }


                    if (!smthDisepear) {
                        // Retirer un sol
                        for (let ig = currentMap.grounds.length - 1; ig >= 0; ig--) {
                            if (mouseX >= currentMap.grounds[ig].x && mouseX < currentMap.grounds[ig].x + currentMap.grounds[ig].w) {
                                if (mouseY >= currentMap.grounds[ig].y && mouseY < currentMap.grounds[ig].y + currentMap.grounds[ig].h) {
                                    for (let ig2 = ig; ig2 < currentMap.grounds.length - 1; ig2++) {
                                        currentMap.grounds[ig2] = currentMap.grounds[ig2 + 1];
                                    }
                                    currentMap.grounds.pop();
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
    } else {
        editor.newGround.state = false;
    }
}

function setMove(k, b) {
    switch (k) {
        case UP_ARROW:
            keys.up = b;
            break;
        case LEFT_ARROW:
            keys.left = b;
            break;
        case RIGHT_ARROW:
            keys.right = b;
            break;
    }
}

function setOverlay() {
    if (frameCount % 10 == 0) {
        fRate = frameRate().toFixed(1);
    }
    if (frameCount % 20 == 0) {
        system.mapTime.now = (Date.now() - system.mapTime.start) / 1000;
    }
    textFont(fRateFont);
    textSize(14);
    fill('#1BCC1B');
    text(fRate, 10, 20);
    fill('#2E9AFE');
    text("Temps: " + (system.mapTime.now).toFixed(2) + "s", 70, 20);
    if (editor.isInside) {
        fill('#FF0000');
        text("ÉDITEUR DE CARTE", 10, 40);

        if (editor.isEditing) {
            fill('#FF0000');
            text("ÉDITION", 10, 60);
        }
    }
}

function preload() {
    fRateFont = loadFont('assets/fonts/monoMMM_5.ttf');
}

function setup() {
    createCanvas(system.swidth, system.sheight);
    frameRate(system.frameRate);
    noStroke();
    fRate = frameRate().toFixed(1);
}

function draw() {
    background(system.background);
    setOverlay();
    
    if (system.allIsLoaded) {

        if (player.spawned) {
            player.px = player.x;
            player.py = player.y;
            player.pvx = player.vx;
            player.pvy = player.vy;

            player.vy += system.gravity;

            if (system.gameActive) {
                if (player.canJump) {
                    if (keys.up) {
                        player.canJump = false;
                        player.otg = false;
                        player.vy = -system.jumpForce;
                    }
                    if (player.otg) {
                        if (keys.right) player.vx += system.moveSpeed.ground * pow(groundsType[currentMap.grounds[player.collision.ground].gType].friction, 1/3);
                        if (keys.left) player.vx -= system.moveSpeed.ground * pow(groundsType[currentMap.grounds[player.collision.ground].gType].friction, 1/3);
                        if (player.vx != 0) player.vx /= 1 + groundsType[currentMap.grounds[player.collision.ground].gType].friction;
                    } else {
                        if (player.vx != 0) player.vx /= system.airDeceleration;
                        if (keys.right) player.vx += system.moveSpeed.air;
                        if (keys.left) player.vx -= system.moveSpeed.air;
                    }
                } else {
                    if (player.vx != 0) player.vx /= system.airDeceleration;
                    if (keys.right) player.vx += system.moveSpeed.air;
                    if (keys.left) player.vx -= system.moveSpeed.air;
                }
            } else {
                if (player.otg) {
                    if (player.vx != 0) player.vx /= 1 + groundsType[currentMap.grounds[player.collision.ground].gType].friction;
                } else {
                    if (player.vx != 0) player.vx /= system.airDeceleration;
                }
            }

            // Limitation au maxspeed
            if (abs(player.vx) > system.maxSpeed) player.vx = (player.vx / abs(player.vx)) * system.maxSpeed;
            if (abs(player.vx) < 0.05) player.vx = 0;
            
            // Modification de la position de self
            player.x += player.vx;
            player.y += player.vy;

            // Vérification des collisions avec les sols
            verifGroundsCollisions();

            if (!player.collision.state) player.otg = false;
            player.collision.state = false;

            // Si self est hors cadre (tombé en bas), respawn()
            if (player.y > system.sheight) nextMap();

            // Vérification des collisions avec checkpoints / trous
            verifCheckpointsCollisions(); // > Checkpoints
            verifHolesCollisions(); // > Trous

        } // Fin de if (player.spawned)

        // Affichage des sols s'il y en a
        if (currentMap.grounds.length !== 0) {
            for (let ig = 0; ig < currentMap.grounds.length; ig++) {
                fill(groundsType[currentMap.grounds[ig].gType].color1);
                rect(currentMap.grounds[ig].x, currentMap.grounds[ig].y, currentMap.grounds[ig].w, currentMap.grounds[ig].h);
            }
        }

        // Affichage des trous s'il y en a
        if (currentMap.mdata.holes.length !== 0) {
            for (let ih = 0; ih < currentMap.mdata.holes.length; ih++) {
                fill(dataType[1].color1);
                rect(currentMap.mdata.holes[ih].x, currentMap.mdata.holes[ih].y, dataType[1].w, dataType[1].w);
            }
        }

        // Affichages des checkpoints s'il y en a
        if (currentMap.mdata.checkpoints.length !== 0) {
            for (let ic = 0; ic < currentMap.mdata.checkpoints.length; ic++) {
                if (player.scheckpoints.list[ic] === false) {
                    fill(dataType[2].color1);
                    rect(currentMap.mdata.checkpoints[ic].x, currentMap.mdata.checkpoints[ic].y, dataType[2].w, dataType[2].w);
                } else if (player.scheckpoints.list[ic] === true && editor.isInside) {
                    fill(dataType[2].color2);
                    rect(currentMap.mdata.checkpoints[ic].x, currentMap.mdata.checkpoints[ic].y, dataType[2].w, dataType[2].w);
                }
            }
        }

        if (player.spawned) {
            // Affichage de player
            fill(player.color1);
            player.sprite = rect(player.x, player.y, player.bSize, player.bSize);
        }

        // Si on est dans l'éditeur
        if (editor.isInside) {

            // Affichages du spawn
            fill(dataType[0].color1);
            rect(currentMap.mdata.spawn.x, currentMap.mdata.spawn.y, dataType[0].w, dataType[0].w);
            
            // Affichage du nouveau sol en cours de tracage
            if (editor.newGround.state) {
                fill(groundsType[editor.newGround.gType].color1);
                rect(editor.newGround.x1, editor.newGround.y1, mouseX - editor.newGround.x1, mouseY - editor.newGround.y1);
            }

            // Affichage de la nouvelle donnée en cours de positionnement
            if (editor.newData.canBeCreated) {
                fill(dataType[editor.newData.dType].color1);
                rect(mouseX - (dataType[editor.newData.dType].w/2), mouseY - (dataType[editor.newData.dType].w/2), dataType[editor.newData.dType].w, dataType[editor.newData.dType].w);
            }
        }
    }
}