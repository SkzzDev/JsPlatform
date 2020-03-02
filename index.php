<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Platform</title>
        <link rel="stylesheet" href="assets/css/style.css" />
        <script src="assets/js/p5js/p5.min.js"></script>
        <script src="assets/js/p5js/addons/p5.dom.min.js"></script>
        <script src="assets/js/p5js/addons/p5.sound.min.js"></script>
        <script src="assets/js/jquery-3.1.1.min.js"></script>
        <script src="assets/js/sketch.js"></script>
        <script src="assets/js/functions.js"></script>
        <script src="assets/js/script.js"></script>
    </head>
    <body>
        <div class="canvas-space">
            <div id="overlay">
                <!--<p id="frameRate"><span class="rate">0</span> fps</p>-->
            </div>
        </div>
        <div class="space">
            <div id="gui">
                <div class="main">
                    <input type="text" id="commands" placeholder="Commandes" />
                    <div class="btn green" id="send">Valider</div>
                    <div class="btn red" id="editor">Éditeur de carte</div>
                </div>
                <div class="editor">
                    <table id="forGrounds">
                        <thead>
                            <tr>
                                <th colspan="4">Sols</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="selectGround" data-ref="0"><div class="inner"></div></td>
                                <td class="selectGround" data-ref="1"><div class="inner"></div></td>
                                <td class="selectGround" data-ref="2"><div class="inner"></div></td>
                                <td class="selectGround" data-ref="3"><div class="inner"></div></td>
                                <td class="selectGround active" data-ref="-1"><div class="inner"></div></td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <table id="forData">
                        <thead>
                            <tr>
                                <th colspan="4">Données</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="selectData" data-ref="0"><div class="inner">Départ</div></td>
                                <td class="selectData" data-ref="1"><div class="inner">Arrivée</div></td>
                                <td class="selectData" data-ref="2"><div class="inner">Checkpoint</div></td>
                                <td class="selectData active" data-ref="-1"><div class="inner"></div></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="btn blue" id="playingMapState" data-state="false">Jouer la carte</div>
                </div>
            </div>
        </div>
    </body>
</html>