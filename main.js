
// Game property set on clicking the play button
const GameType = { Daily: 1, Endless: 2};
var property_official = false;
var property_females = false;
var property_gametype = GameType.Daily;

var gamedata;
var lastcard;

/* Ajax call to fully reload the data object from a serverside pure Json file. */
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

/* Loads a random card from pruned gamedata */
function loadCardRandom() {
    if(!gamedata || !gamedata.length){
        console.error("Could not load a random play card. Data dump : " + gamedata);
        return;
    }
    lastcard = gamedata[ Math.floor(Math.random() * gamedata.length) ];
    
    var canvas = document.getElementById("playfield-canvas");
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2 - lastcard.posx;
    var centerY = canvas.height / 2 - lastcard.posy;
    var imageObj = new Image();
    imageObj.src = lastcard.content;
    imageObj.onload = function () {
        context.drawImage(imageObj, centerX, centerY);
    };

    console.log("Loaded image from " + lastcard.answer + ", card link : " + lastcard.content);
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

});
