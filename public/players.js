var playerElements = {}
var playerId
var playersArr = []
var playerRef
var players = {}
var cooldown = true
var serverId

const allPlayersRef = firebase.database().ref(`players`)   
allPlayersRef.on("child_added", (snapshot) => {
    
    //Fires whenever new node/player is added
    const addedPlayer = snapshot.val()
    const characterElement = document.createElement("div")  
    characterElement.classList.add("Character", "grid-cell")
    if(addedPlayer.id === playerId){
        characterElement.classList.add("you")
    }
    characterElement.innerHTML = (`
        <div class="Character_hat grid-cell"></div>
        <div class="Character_shadow grid-cell"></div>
        <div class="Character_sprite grid-cell"></div>
        <div class="sword"></div>
        <div class="Character_name-container">
            <span class="Character_name"></span>
            <span class="Character_coins">0</span>
            <div id="myProgress">
                <div id="myBar"></div>
            </div>
            <div id="myProgress">
                <div id="myBar"></div>
            </div>
        </div>
        <div class="Character_you-arrow"></div>
    `)
    playerElements[addedPlayer.id] = characterElement
    playersArr.push(addedPlayer.id)

    //fill some initial state
    characterElement.querySelector(".Character_name").innerText = addedPlayer.name
    characterElement.querySelector(".Character_coins").innerText = addedPlayer.coins
    characterElement.setAttribute("data-color", addedPlayer.color)
    characterElement.setAttribute("data-direction", addedPlayer.direction)
    characterElement.querySelector(".sword").setAttribute("data-direction", addedPlayer.direction)
    const left = 16 * addedPlayer.x + "px"
    const top = 16 * addedPlayer.y - 4 + "px"
    characterElement.style.transform = `translate3d(${left}, ${top}, 0)`
    Bars = characterElement.querySelectorAll("#myBar")
    Bars[0].style.width = `${addedPlayer.health}%`
    Bars[1].style.width = `${addedPlayer.mana}%`
    Bars[1].style.backgroundColor = `blue`
    gameContainer.appendChild(characterElement)

    
        // when player is damaged
        characterElement.querySelector(".Character_sprite").addEventListener("animationend", () => {
            let res = players[playerId].states
            if(res.indexOf("hurt") > -1){
                res.splice(res.indexOf("hurt"), 1)
            }
            playerRef.update({
                collide: true,
                states: res
            })
        })

        characterElement.addEventListener("transitionend", () => {
            if(playerElements[playerId].style.opacity == 0){
                playerElements[playerId].style.opacity = 1
                Dwn.bind()
                Up.bind()
                Lft.bind()
                Right.bind()
            }
        })

    })

    // remvoe player on leave
    allPlayersRef.on("child_removed", (snapshot) => {
        if(snapshot.val().id == serverId){
            removeClock("mArmy", true)
            removeClock("sArmy", true)
        }
        const removeKey = snapshot.val().id
        gameContainer.removeChild(playerElements[removeKey])
        playersArr.splice(playersArr.indexOf(removeKey), 1)
        delete playerElements[removeKey]
    })

    allPlayersRef.on("value", (snapshot) => {
    //Fires when a change occures
    players = snapshot.val() || {}
    console.log("SERVER: " +  Object.keys(players)[0])
    serverId = Object.keys(players)[0]
    if(serverId == playerId){
        if(!isClock("mArmy")){
            startClock(moveArmy, 1000, "mArmy", true)
        }
        if(!isClock("sArmy")){
            startClock(newEnemy, 1000, "sArmy", true)
        }
    }
    Object.keys(players).forEach((key) => {
        const characterState = players[key]
        let el = playerElements[key]
        const sword = el.querySelector(".sword")

        // running through enemy
        if (enemiesArr.some(e => enemies[e].x === characterState.x && enemies[e].y === characterState.y && enemies[e].map === characterState.map)) {
            characterState.health -= 10
         }

        // update DOM
        el.querySelector(".Character_name").innerText = characterState.name
        el.querySelector(".Character_coins").innerText = characterState.coins
        el.setAttribute("data-color", characterState.color)
        el.setAttribute("data-direction", characterState.direction)
        sword.setAttribute("data-direction", characterState.direction)
        sword.style.background =   `url(https://multiplayer-game-160be.web.app/images/Assets/${characterState.weapon}.png) no-repeat no-repeat`
        const left = 16 * characterState.x + "px"
        const top = 16 * characterState.y - 4 + "px"
        el.style.transform = `translate3d(${left}, ${top}, 0)`
        Bars = el.querySelectorAll("#myBar")

        Bars[0].style.width = `${characterState.health}%`
        Bars[1].style.width = `${characterState.mana}%`
        Bars[1].style.backgroundColor = `blue`


        if(characterState.states.includes("slash")){
            sword.classList.add("slash")
        }else{
            sword.classList.remove("slash")  
        } 
        if(characterState.states.includes("hurt")){
            el.querySelector(".Character_sprite").style.animation = "blink 0.2s linear 10"
        }else{
            el.querySelector(".Character_sprite").style.animation = ""
        }
        if(characterState.mana <= 0){
            el.querySelector(".sword").style.opacity = "75%"
        }else{
            el.querySelector(".sword").style.opacity = "100%" 
        }

        // Hide players on different maps
        if(characterState.map != players[playerId].map){
            el.style.display = "none"
        }else{
            el.style.display = "block"
        }

        if(bossProps.map != players[playerId].map){
            bossElement.style.display = "none";
         }else{
            bossElement.style.display = "block";
         }
    })

})


//CONTROLS
function handleArrowPress(xchange=0, yChange=0){
    const newX = players[playerId].x + xchange
    const newY = players[playerId].y + yChange

    if(!isSolid(newX, newY)){
        // Move to next space
        players[playerId].x = newX
        players[playerId].y = newY
        if(xchange > 0){
            players[playerId].direction = "right"
        }
        if(xchange < 0){
            players[playerId].direction = "left"
        }
        playerRef.set(players[playerId]);
        attemptGrabCoin(newX, newY)
    }
}


document.addEventListener("mousedown", click)
function click(e){
    if(e.button == 0 && !players[playerId].states.includes("slash") && players[playerId].mana > 0){
        let res = players[playerId].states
        res.push("slash")
        playerRef.update({
            states: res
        })

        checkEnemyHit(players[playerId])

        playerElements[playerId].querySelector(".sword").addEventListener("animationend", () => {
            let res = players[playerId].states
            if(res.indexOf("slash") > -1){
                res.splice(res.indexOf("slash"), 1)
            }
            playerRef.update({
                states: res
            })
            cooldown = true
        })
    }
}


function playerDie(){
    const {x, y} = getRandomSafeSpot()
    playerRef.update({
        id: playerId,
        direction: "right",
        x,
        y,
        coins: 0,
        mana: 0,
        health: 100,
        collide: false,
        map: "map"

    })
    Dwn.unbind()
    Up.unbind()
    Lft.unbind()
    Right.unbind()
    playerElements[playerId].style.opacity = 0
}

function playerReset(){
    const {x, y} = getRandomSafeSpot()
    playerRef.update({
        direction: "right",
        x,
        y,
    })
}