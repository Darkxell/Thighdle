
// Game property set on clicking the play button
const GameType = { Daily: 1, Endless: 2};
var property_official = false;
var property_females = false;
var property_gametype = GameType.Daily;

var gamedata;
var lastcard;

const CurrentGameData = { defaultzoom : 200, zoom : 200, attempts : [], streak : 0};

/** Ajax call to fully reload the data object from a serverside pure Json file. */
function loadJsonData(callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', 'data.json', true);
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);  
}

/** Draws The champion from the parsed card at the wanted zoom level 
 * Zoom: The width of the source image to draw to the canvas, in pixels
*/
function drawChampionCard(card, zoom){
    var canvas = document.getElementById("playfield-canvas");
    var destination_width = canvas.width;
    var destination_height = canvas.height;
    var context = canvas.getContext("2d");
    var source_left = card.posx - zoom / 2;
    var source_top = card.posy - zoom / 2;
    var source_height = zoom * destination_height / destination_width;
    var imageObj = new Image();
    imageObj.src = card.content;
    imageObj.onload = function () {
        context.drawImage(imageObj, source_left, source_top, zoom, source_height, 0, 0, destination_width, destination_height);
    };
}

/** Loads a random card from pruned gamedata */
function loadCardRandom() {
    CurrentGameData.zoom = CurrentGameData.defaultzoom;
    CurrentGameData.attempts = [];
    $("#faillist").empty();
    if(!gamedata || !gamedata.length){
        console.error("Could not load a random play card. Data dump : " + gamedata);
        return;
    }

    lastcard = gamedata[ Math.floor(Math.random() * gamedata.length) ];
    drawChampionCard(lastcard, CurrentGameData.defaultzoom);

    console.log("Loaded image from " + lastcard.answer + ", card link : " + lastcard.content);
}

/** Event called upon pressing the answer button, when the player wins. */
function onAnswerWin() {
    loadCardRandom();
}

/** Event called upon pressing the answer button, when the player looses. 
 * Note that this event is NOT always called on pressing the answer button, as edge cases may not trigger a complete fail (like an empty field). */
function onAnswerLoose(guess) {
    CurrentGameData.zoom += 25;
    CurrentGameData.attempts.push(guess);
    $("#faillist").empty();
    CurrentGameData.attempts.forEach(elem => $("#faillist").append(elem + " "));
    
    drawChampionCard(lastcard, CurrentGameData.zoom);
}

/* Onclick event handling */
$(document).ready(function(){

    // Ajax load gamedata
    loadJsonData(function(response) {
        gamedata = JSON.parse(response);
        console.log("Finished parsing Json game data with " + gamedata.length + " elements. Enabling play button.");
        // TODO : show the play button (hidden until then) here, to prevent playing with an empty dataset
    });

    //Start button game handling
    $("#button-start").click(function(){
        property_official = $("#option-official").is(":checked");
        property_females = $("#option-females").is(":checked");
        property_gametype = $("#option-daily").is(":checked") ? GameType.Daily : GameType.Endless;

        $("#page-landing").hide();
        $("#page-play").show();

        // Prune game data to only leave the correct cards
        if(gamedata)
        gamedata = gamedata.filter(function(item) {
            if(property_females && !item.female) return false;
            if(property_official && !item.official) return false;

            return true;
        });

        console.log("Game started with the following properties :\nOfficial " + property_official 
            + "\nFemales only " + property_females + "\nGameType " + property_gametype
            + "\nGamedata still contains " + gamedata.length + " play cards.");
    
        loadCardRandom();
    });

    // Answer button
    $("#answer-button").click(function(){
        var answer = $("#answer-field").val().toLowerCase();
        console.log("Answered \"" + answer + "\", actual answer was : " + lastcard.answer);
        if(answer === lastcard.answer){
            onAnswerWin();
        } else {
            //TODO : Add checks here for malformed data to not loose but just cancel the attempt
            onAnswerLoose(answer);
        }
    });

});
