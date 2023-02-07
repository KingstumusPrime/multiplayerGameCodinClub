var clocks = {}
function startClock(func, time, name){
    clocks[name] = setInterval(func, time)
}


function stopClock(name) {
    clearInterval(clocks[name])
}