var clocks = {}
function startClock(func, time, name){
    clocks[name] = setInterval(func, time)
}
function tick(){
    console.log("TICK")
}

function stopClock(name) {
    clearInterval(clocks[name])
}