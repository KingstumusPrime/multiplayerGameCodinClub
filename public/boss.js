let bossElement


firebase.database().ref("boss/").on("child_added", (snapshot) => {
    const addedBoss = snapshot.val()
    bossElement = document.createElement("div")  
    bossElement.classList.add("Character", "grid-cell")

    bossElement.innerHTML = (`
      <div class="Character_hat grid-cell"></div>
      <div class="Character_shadow grid-cell"></div>
      <div class="Character_sprite grid-cell"></div>
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
    bossProps = addedBoss
    //fill some initial state
    bossElement.querySelector(".Character_name").innerText = addedBoss.name
    bossElement.querySelector(".Character_coins").innerText = addedBoss.coins
    bossElement.setAttribute("data-color", addedBoss.color)
    bossElement.setAttribute("data-direction", addedBoss.direction)
    const left = 16 * addedBoss.x + "px"
    const top = 16 * addedBoss.y - 5 + "px"
    bossElement.style.transform = `translate3d(${left}, ${top}, 0)`
    Bars = bossElement.querySelectorAll("#myBar")
    Bars[0].style.width = `${addedBoss.health}%`
    Bars[1].style.width = `${addedBoss.mana}%`
    Bars[1].style.backgroundColor = `blue`
    gameContainer.appendChild(bossElement)
})

// update boss when they move
firebase.database().ref("boss/slimeking").on("value", (snapshot) => {
        if(boss == true){
            console.log("MAKING BOSSES NANAN")
            //Fires when a change occures
            const boss = snapshot.val()
            let el = bossElement
            if(el){
            // update DOM
            el.querySelector(".Character_name").innerText = boss.name
            el.querySelector(".Character_coins").innerText = boss.coins
            el.setAttribute("data-color", boss.color)
            el.setAttribute("data-direction", boss.direction)
            const left = 16 * boss.x + "px"
            const top = 16 * boss.y - 5 + "px"
            el.style.transform = `translate3d(${left}, ${top}, 0)`
            Bars = el.querySelectorAll("#myBar")
            Bars[0].style.width = `${boss.health}%`
            Bars[1].style.width = `${boss.mana}%`
            Bars[1].style.backgroundColor = `blue`
            bossProps = boss
        }
    }
})
// remove boss
firebase.database().ref(`boss/`).on("child_removed", (snapshot) => {
    boss = false
    gameContainer.removeChild(bossElement)
    delete bossElement
    setTimeout(makeBoss, 100000)
})



function makeBoss(){
    console.log("made")
    bossRef = firebase.database().ref(`boss/slimeking`)
    const {x, y} = getRandomSafeSpot()
    bossRef.set({
        name: "Slime King",
        direction: "right",
        x,
        y,
        color: "dark",
        coins: 0,
        mana: 100,
        health: 100,
        map: "map"
    })
    boss = true
    collideSword()
    collideBoss()
    moveBoss()
}

function moveBoss(){
    if(boss == true){
        const inZone = weed(players, "map", bossProps.map)
        if(inZone.length > 0){
            var randProps = randomFromArray(inZone)
            if(randProps){
                const player = randProps
                const x = player.x
                const y = player.y
                bossRef.update({
                    x,
                    y
                })
            }
        }
        setTimeout(() => {
            moveBoss()
        }, 10000)
    }
}


function collideBoss(){
    if(boss && bossElement && boss.map == playerElements[playerId].map){
        const bound = playerElements[playerId].querySelector(".Character_sprite").getBoundingClientRect()

        const bossBound = bossElement.querySelector(".Character_sprite").getBoundingClientRect()
        const  overlap = !(bound.right - 3 < bossBound.left || 
            bound.left + 3 > bossBound.right || 
            bound.bottom < bossBound.top + 3|| 
            bound.top  > bossBound.bottom)
        if(overlap && players[playerId].collide && !players[playerId].states.includes("hurt")){
            let res = players[playerId].states
            res.push("hurt")
            playerRef.update({
                health: players[playerId].health - 10,
                collide: true,
                states: res
            })
            if(players[playerId].health <= 0){
                playerDie()
            }
        }
    }
    setTimeout(() => {
        collideBoss()
    }, 5)
}

function collideSword(){
    if(boss && bossElement ){
        const bound = playerElements[playerId].querySelector(".sword").getBoundingClientRect()

        const bossBound = bossElement.querySelector(".Character_sprite").getBoundingClientRect()
        const  overlap = !(bound.right - 3 < bossBound.left || 
            bound.left + 3 > bossBound.right || 
            bound.bottom < bossBound.top + 3|| 
            bound.top  > bossBound.bottom)
        if(overlap && playerElements[playerId].querySelector(".sword").classList.value == "sword slash" && cooldown == true){
            cooldown = false
            playerRef.update({
                mana: players[playerId].mana - 10
            })
            bossRef.update({
                health: bossProps.health - 10,
            })
            if(bossProps.health <= 0){
                boss = false
                bossRef.remove()
            }
        }
    }
    setTimeout(() => {
        collideSword()
    }, 5)
}