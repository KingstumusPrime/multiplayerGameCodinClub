var clocks = {}
function startClock(func, time, name, ServerBased){
    if(ServerBased){
        if(playerId == serverId){
            clocks[name] = setInterval(func, time)
            console.log("IS SERVER")
        }else{
            console.log("NOT SERVER")
        }
    }else{
        clocks[name] = setInterval(func, time)
    }
}


function stopClock(name, ServerBased) {
    if(ServerBased){
        if(playerId == serverId){
                clearInterval(clocks[name])
        }
    }else{
            clearInterval(clocks[name])
    }
}

function removeClock(name, serverBased){
    if(ServerBased){
        if(playerId == serverId){
                clearInterval(clocks[name])
                delete clocks[name]
        }
    }else{
            clearInterval(clocks[name])
            delete clocks[name]
    }
}

function isClock(name){
    return name in clocks
}
