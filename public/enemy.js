var enemyElements = {}
var enemiesArr = []
var enemies = {}


const allEnemiesRef = firebase.database().ref(`enemies`)    
allEnemiesRef.on("child_added", (snapshot) => {
    
        //Fires whenever new node/player is added
        const addedEnemy = snapshot.val()
        const enemyElement = document.createElement("div")  
        enemyElement.classList.add("enemy", "grid-cell")
        enemyElement.innerHTML = (`
            <div class="Character_shadow grid-cell"></div>
            <div class="enemy_sprite grid-cell"></div>
            <div class="Character_name-container">
            <div id="myProgress">
                <div id="myBar"></div>
            </div>
            <div id="myProgress">
                <div id="myBar"></div>
            </div>
            </div>
        `)
        enemyElements[addedEnemy.id] = enemyElement
        enemiesArr.push(addedEnemy.id)

        //fill some initial state
        enemyElement.setAttribute("data-direction", addedEnemy.direction)
        const left = 16 * addedEnemy.x + "px"
        const top = 16 * addedEnemy.y - 4 + "px"
        enemyElement.style.transform = `translate3d(${left}, ${top}, 0)`
        Bars = enemyElement.querySelectorAll("#myBar")
        Bars[0].style.width = `${addedEnemy.health}%`
        Bars[1].style.width = `${addedEnemy.mana}%`
        Bars[1].style.backgroundColor = `blue`
        gameContainer.appendChild(enemyElement)
    })

    // fire when killed
    allEnemiesRef.on("child_removed", (snapshot) => {
        const removeKey = snapshot.val().id
        gameContainer.removeChild(enemyElements[removeKey])
        enemiesArr.splice(enemiesArr.indexOf(removeKey), 1)
        delete enemyElements[removeKey]
    })

    allEnemiesRef.on("value", (snapshot) => {
    //Fires when a change occures
    enemies = snapshot.val() || {}
    Object.keys(enemies).forEach((key) => {
        const enemyState = enemies[key]
        let el = enemyElements[key]
        // update DOM
        el.setAttribute("data-direction", enemyState.direction)
        const left = 16 * enemyState.x + "px"
        const top = 16 * enemyState.y - 4 + "px"
        el.style.transform = `translate3d(${left}, ${top}, 0)`
        Bars = el.querySelectorAll("#myBar")
        Bars[0].style.width = `${enemyState.health}%`
        Bars[1].style.width = `${enemyState.mana}%`
        Bars[1].style.backgroundColor = `blue`

        if(players[playerId].map != enemyState.map){
            el.style.display = "none";
        }else {
            el.style.display = "block";
        }
    })
})



function spawnEnemy(id){
    const {x, y} = getRandomSafeSpot()
    firebase.database().ref(`enemies/${id}`).set({
        id: id,
        direction: "right",
        x,
        y,
        mana: 100,
        health: 100,
        collide: true,
        map: "Castle"
    })
}


function enemyDie(){
    // const {x, y} = getRandomSafeSpot()
    // playerRef.update({
    //     id: playerId,
    //     direction: "right",
    //     color: randomFromArray(playerColors),
    //     x,
    //     y,
    //     coins: 0,
    //     mana: 0,
    //     health: 100,
    //     collide: false
    // })
    // Dwn.unbind()
    // Up.unbind()
    // Lft.unbind()
    // Right.unbind()
    // playerElements[playerId].style.opacity = 0
}

function getClosestPlayer(players, id){

    if(enemies[id]){
        var enemy = enemies[id];
        const validPlayers = weed(players, "map", enemy.map)
        if(validPlayers.length > 0){
            let closet = validPlayers[0];
            validPlayers.forEach((p) =>{
                console.log(p)
                if( Math.abs((Math.abs(enemy.x) + Math.abs(enemy.y)) - (Math.abs(p["x"]) + Math.abs(p["y"])))  < Math.abs((Math.abs(closet.x) + Math.abs(closet.y)) - (Math.abs(p["x"]) + Math.abs(p["y"])))){
                    closet = players[p];
                }
            })
            console.log(closet);
            moveTo(closet, enemy);
        }
    }
}

function moveTo(player, enemy){
    // Farthest value is to the y
    if(Math.abs(Math.abs(enemy.y) - Math.abs(player.y)) > Math.abs(Math.abs(enemy.x) - Math.abs(player.x))){
        // y is greater should we move up or down
        if(enemy.y > player.y){
            if(!mapData.blockedSpaces[getKeyString(enemy.x, enemy.y - 1)]){
                enemy.y -= 1;
            }else{
                randomDir(enemy, player);
            }
        }else if(enemy.y < player.y){
            if(!mapData.blockedSpaces[getKeyString(enemy.x, enemy.y + 1)] ){
                enemy.y += 1;
            }else{
                randomDir(enemy, player);
            }
        }
    } else {
        // x is greater should we move left or right
        if(enemy.x > player.x){
            if(!mapData.blockedSpaces[getKeyString(enemy.x - 1, enemy.y)]){
                enemy.x -= 1;
                enemy.direction ="right"
            }else{
                randomDir(enemy, player);
            }
        }else if(enemy.x < player.x) {
            if(!mapData.blockedSpaces[getKeyString(enemy.x + 1, enemy.y)]){
                enemy.x += 1;
                enemy.direction = "left"
            }else{
                randomDir(enemy, player);
            }
        }
    }

    firebase.database().ref(`enemies/${enemy.id}`).update({
        x: enemy.x,
        y: enemy.y,
        direction: enemy.direction,
    })

    if(enemy.x== player.x && enemy.y == player.y){
        console.log("OOF")
        player.health -= 10;
        if(player.id == playerId){
            playerRef.update({
                health: player.health
            })
        }
        if(player.health <= 0){
            const {x, y} = getRandomSafeSpot()
            firebase.database().ref(`players/${player.id}`).update({
                id: playerId,
                direction: "right",
                color: randomFromArray(playerColors),
                x,
                y,
                coins: 0,
                mana: 0,
                health: 100,
                collide: false,
            })
            if(player.id == playerId){
                Dwn.unbind()
                Up.unbind()
                Lft.unbind()
                Right.unbind()
                playerElements[playerId].style.opacity = 0
            }
        }
    }
}

// if you cannot move then choose random direction
function randomDir(enemy, player) {
    if(!mapData.blockedSpaces[getKeyString(enemy.x, enemy.y - 1)]){
        enemy.y -= 1;
    }else{
        if(!mapData.blockedSpaces[getKeyString(enemy.x - 1, enemy.y)]){
            enemy.x -= 1;
            enemy.direction ="right"
        }else{
            if(!mapData.blockedSpaces[getKeyString(enemy.x + 1, enemy.y)]){
                enemy.x += 1;
                enemy.direction ="left"
            }else{
                if(!mapData.blockedSpaces[getKeyString(enemy.x, enemy.y + 1)] ){
                    enemy.y += 1;
                }
            }
        }
    }
    
    if(enemy.x == player.x && enemy.y == player.y){
        console.log("OOF")
        player.health -= 10;

        if(player.health <= 0){
            const {x, y} = getRandomSafeSpot()
            firebase.database().ref(`players/${player.id}`).update({
                id: playerId,
                direction: "right",
                color: randomFromArray(playerColors),
                x,
                y,
                coins: 0,
                mana: 0,
                health: 100,
                collide: false,
            })
            if(player.id == playerId){
                Dwn.unbind()
                Up.unbind()
                Lft.unbind()
                Right.unbind()
                playerElements[playerId].style.opacity = 0
            }
        }
    }
}

// Update enemys
function updateEnemies(){
    Object.keys(enemies).forEach((eId) => {
        console.log()
        if(enemies[eId]["map"] != players[playerId].map){
            enemyElements[eId].style.display = "none"
        }else{
            console.log("SHOW YOURSELF")
            enemyElements[eId].style.display = "block"
        }
    })
}

function moveArmy(){
    Object.keys(enemies).forEach((e) => {
        getClosestPlayer(players, e) 
    })
}