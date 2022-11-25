
// Game property set on clicking the play button
const GameType = { Daily: 1, Endless: 2};
var property_official = false;
var property_females = false;
var property_gametype = GameType.Daily;

$(document).ready(function(){

    //Start button game handling
    $("#button-start").click(function(){
        property_official = $("#option-official").is(":checked");
        property_females = $("#option-females").is(":checked");
        property_gametype = $("#option-daily").is(":checked") ? GameType.Daily : GameType.Endless;

        $("#page-landing").hide();
        $("#page-play").show();

        console.log("Game started with the following properties : Official " + property_official + " / Females only " + property_females + " / GameType " + property_gametype);
    });



});

// Event called to change the canvas to a new data