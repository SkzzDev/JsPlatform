function getRandomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

function resetBird(x, y)
{
    if (typeof x === "undefined") x = currentMap.mdata.spawn.x - (dataType[0].w/2);
    if (typeof y === "undefined") y = currentMap.mdata.spawn.y - (dataType[0].w/2);
    player.x = x;
    player.y = y;
    player.otg = false;
    player.canJump = true;
    player.pvy = 0;
    player.pvy = 0;
    player.px = 0;
    player.py = 0;
    player.vy = 0;
    player.vy = 0;
    player.collision.state = false;
    player.collision.ground = 0;
}

function respawn(x, y)
{
    player.spawned = player.canSpawn;
    resetBird(x, y);
    if (editor.isInside) setCheckpoints();
}

function despawn()
{
    player.spawned = false;
    resetBird();
    if (editor.isInside) setCheckpoints();
}

function updateCanSpawn(boolean)
{
    player.canSpawn = boolean;
}

function resetMap()
{
    currentMap.grounds = [];
    currentMap.mdata.spawn.x = (system.swidth/2) - (player.bSize/2);
    currentMap.mdata.spawn.y = (system.sheight/2) - (player.bSize/2);
    currentMap.mdata.holes = [];
    currentMap.mdata.checkpoints = [];
}

function goToEditor()
{
    system.currentMapCode = -1;
    resetMap();
    player.canSpawn = false;
    player.spawned = false;
    editor.isInside = true;
}

function exitEditor()
{
    editor.isInside = false;
    editor.editing = false;
    player.canSpawn = true;
    nextMap();
}

function loadMap(code)
{
    let rmf = readMapFile(code);
    if (rmf !== false) { // Si la carte existe
        editor.newData.canBeCreated = false;
        editor.newGround.canBeCreated = false;
        editor.newGround.state = false;
        system.currentMapCode = code;
        currentMap = rmf;
        setCheckpoints();
        selectGround(-1);
        selectData(-1);
        if (editor.isInside) {
            player.canSpawn = false;
        } else {
            respawn();
        }
        system.mapTime.start = Date.now();
    }
}


function nextMap()
{
    if (editor.isInside) {
        respawn();
    } else {
        loadMap(mapList[getRandomInt(mapList.length)]);
    }
}

function readMapFile(code)
{
    let mapData = null;

    $.ajax({
        url: "/jsPlatform/maps/map" + code + ".txt",
        async: false,
        success: function (data){
            mapData = JSON.parse(data);
        },
        error: function() {
            alert("La carte " + code + " n'existe pas.");
            mapData = false;
        }
    });

    return mapData;
}

function selectGround(ref, elem)
{
    $(".selectGround").removeClass("active");
    
    if (typeof elem !== "undefined") {
        $(elem).addClass("active");
    } else {        
        $(".selectGround[data-ref='-1']").addClass("active");
    }

    if (ref >= 0) {
        editor.newGround.canBeCreated = true;
        editor.newGround.gType = ref;
    } else {
        editor.newGround.canBeCreated = false;
        editor.newGround.state = false;
    }
}

function selectData(ref, elem)
{
    $(".selectData").removeClass("active");
    
    if (typeof elem !== "undefined") {
        $(elem).addClass("active");
    } else {        
        $(".selectData[data-ref='-1']").addClass("active");
    }

    if (ref >= 0) {
        editor.newData.canBeCreated = true;
        editor.newData.dType = ref;
    } else {
        editor.newData.canBeCreated = false;
    }
}

function exportMap()
{
    let newWindow = window.open("about:blank", "", "_blank");
    if (newWindow) newWindow.document.write(JSON.stringify(currentMap));
}