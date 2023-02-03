
var mapData = {
    minX: 1,
    maxX: 14,
    minY: 4,
    maxY: 12,
    blockedSpaces: {
        "7x4": true,
        "1x11": true,
        "12x10": true,
        "4x7": true,
        "5x7": true,
        "6x7": true,
        "8x6": true,
        "9x6": true,
        "10x6": true,
        "7x9": true,
        "8x9": true,
        "9x9": true,
    },
    specialSpaces: {
        "3x4": "Coffe Shop",
        "11x4": "Pizza Shop"
    }
}

const tooltipMap = {
    Castle: "Castle: The home of the dangerous HUMANS who think they can go on quests to kill monsters like yourself. Tread with caution!!!",
    map: "Home: A cozy safe house where a slime can by a coffee and hang out"
}

var prevText;

var id = "map"
function changeMap(){

    // change modal to map select
    modal.querySelector(".modal-bod").innerHTML = `
    <p class="tooltip"></p>
    `
    modal.querySelector(".modal-head").innerHTML = `
    <div class="map-select">
    
        <button class="map-btn" id="map">
            <img src="https://multiplayer-game-160be.web.app/images/map.png">
        </button>
        <button class="map-btn" id="Castle">
            <img src="https://multiplayer-game-160be.web.app/images/Castle.png">
        </button>
        
    </div>
    `

    modal.classList.add("active")


    document.querySelectorAll(".map-btn").forEach((e)=> {
        e.addEventListener("mouseover", (emouse) => {
            document.querySelector(".tooltip").innerText = tooltipMap[e.id]
        })

        e.addEventListener("mouseout", (emouse) => {
            document.querySelector(".tooltip").innerText = ""
        })

        e.addEventListener("click", (emouse) => {
            if(e.id == "Castle"){
                console.log("G")
                mapData = {
                    minX: 1,
                    maxX: 14,
                    minY: 4,
                    maxY: 12,
                    blockedSpaces: {
                        "12x10": true,
                        "1x11": true,
                        
                    },
                    specialSpaces: {
                    }
                }
            }else{
                mapData = {
                    minX: 1,
                    maxX: 14,
                    minY: 4,
                    maxY: 12,
                    blockedSpaces: {
                        "7x4": true,
                        "1x11": true,
                        "12x10": true,
                        "4x7": true,
                        "5x7": true,
                        "6x7": true,
                        "8x6": true,
                        "9x6": true,
                        "10x6": true,
                        "7x9": true,
                        "8x9": true,
                        "9x9": true,
                    },
                    specialSpaces: {
                        "3x4": "Coffe Shop",
                        "11x4": "Pizza Shop"
                    }
                }
            }

            console.log(gameContainer.style)
            if(e.id != id){
                id = e.id
                modal.classList.remove("active")
                playerDie()
                playerRef.update({
                    map: e.id,
                    collide: true
                })
                upSwipe()
            }else{
                
            }
        })
    })
    
}

// swipe animation
var x = document.querySelector(".swipe");
var p = 0;

function upSwipe() {
    x.style.width = "100vw"
    if(p < window.innerHeight){
        p += 18;
        x.style.height = p + "px";
        requestAnimationFrame(upSwipe);
    }else{
        updateEnemies()
        document.querySelector(".game-container").style.backgroundImage = `url(https://multiplayer-game-160be.web.app/images/${id}.png)`
        setTimeout(downSwipe, 200)
    }
}

function downSwipe() {
    if(p > 0){
        p -= 20;
        x.style.height = p + "px";
        requestAnimationFrame(downSwipe);
    }else{
        x.style.width = "0px"
    }
}


