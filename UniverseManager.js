let universe = null;

$(() => {     
    InitUniverse();  
    $("#level").change(function (e) {       
        SetUniverseSize();
    });    
    $("#speed").change(function (e) {       
        SetAnimationSpeed();
    });       
    $("#anim").change(function (e) { 
        SetUniverseAnimationMarker();
    });
    $("#restart").click(function (e) { 
        InitUniverse();
    });
    $("#start").click(function (e) { 
        if (universe.GetAnimationMarker(universe.GetAnimationMarker()) && universe.Animation == null) {
            startAnimation();
        } else {
            stopAnimation();
        }
    });    
});

function InitUniverse() {
    stopAnimation();
    universe = new Universe();
    SetUniverseSize();    
    SetAnimationSpeed();
    SetUniverseAnimationMarker();
}
function SetUniverseAnimationMarker(){
    let val = $("#anim").prop("checked");
    if (!val) {
        stopAnimation();
    }
    universe.SetAnimationMarker(val);
}
function SetUniverseSize() {  
    let levelText = $("#level").val();
    $("#levelView").text(levelText);
    universe.DrawSetLevel(parseInt(levelText));
}
function SetAnimationSpeed() {
    let speedText = $("#speed").val();
    universe.AnimationSpeed = parseInt(speedText);
    $("#speedView").text(speedText);
}
function startAnimation() {
    $("#start").text("Stop");
    universe.Animation = window.requestAnimationFrame(() => {universe.AnimateDrawNextGeneration(universe.Animation)});
}
function stopAnimation() {    
    if (universe != null && universe.Animation != null) {
        window.cancelAnimationFrame(universe.Animation);
        universe.Animation = null;   
        $("#start").text("Start");
    }
}