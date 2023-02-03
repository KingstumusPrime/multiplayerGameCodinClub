(function () {
    var modal_buy
    updateEnemies()
    playerWeapons = [...Array(51).keys()]
    playerWeapons.shift()

    chat = document.querySelector(".chat")

    function atShop(){
        let currentShop = mapData.specialSpaces[getKeyString(players[playerId].x, players[playerId].y)]
        const modal = document.querySelector(".modal")

        if(currentShop != undefined){
            modal.querySelector(".modal-head").innerText = currentShop
            let property = ""
            let shopText = ""
            if(currentShop == "Pizza Shop"){
                shopText = "Pay 10 coins to refil health"
                property = "health"
            }else {
                shopText = "Pay 10 coins to refil mana"
                property = "mana"
            }
            modal.querySelector(".modal-bod").innerHTML = `
            <p>${shopText}</p>
            <button class="modal-buy">click here</button>
            `
            modal_buy = modal.querySelector(".modal-buy")
            

            openModal()
            modal_buy.addEventListener("click", () => {
                if(players[playerId].coins >= 10 && players[playerId][property] != 100){
                    playerRef .update({
                        coins: players[playerId].coins - 10,
                    })
                    if(property == "mana"){
                        playerRef.update({
                            mana: 100
                        })
                    }else{
                        playerRef.update({
                            health: 100
                        })
                    }
                    closeModal()
                    closeModalBtn.blur()
                    Dwn.bind()
                    Up.bind()
                    Lft.bind()
                    Right.bind()
                    chatInput.disabled = false
                }
            })  
        }
    }

    function initGame() {
        spawnEnemy("bKnight1");
        spawnEnemy("bKnight2");
        spawnEnemy("bKnight3");
        spawnEnemy("bKnight4");
        Up = new KeyPressListener("KeyW", () => handleArrowPress(0, -1))
        Dwn = new KeyPressListener("KeyS", () => handleArrowPress(0, 1))
        Lft = new KeyPressListener("KeyA", () => handleArrowPress(-1, 0))
        Right = new KeyPressListener("KeyD", () => handleArrowPress(1, 0))
        SpaceBar = new KeyPressListener("Space", () => atShop())

        const allCoinsRef = firebase.database().ref(`coins`)
    
        allCoinsRef.on("value", (snapshot) => {
            coins = snapshot.val() || {};
          });
          
        allCoinsRef.on("child_added", (snapshot) => {
            const coin = snapshot.val()
            const key = getKeyString(coin.x, coin.y)
            coins[key] = true

            //Create the DOM Element
            const coinElement = document.createElement("div")
            coinElement.classList.add("Coin", "grid-cell")
            coinElement.innerHTML = `
            <div class="Coin_shadow grid-cell"></div>
            <div class="Coin_sprite grid-cell"></div>
            `

            // Position the Element
            const left = 16 * coin.x + "px"
            const top = 16 * coin.y - 4 + "px"
            coinElement.style.transform = `translate3d(${left}, ${top}, 0)`

            //Keep a refence to later on remove the coin
            coinElements[key] = coinElement
            gameContainer.appendChild(coinElement)
        })
        allCoinsRef.on("child_removed", (snapshot) => {
            const {x,y} = snapshot.val();
            const keyToRemove = getKeyString(x,y);
            gameContainer.removeChild( coinElements[keyToRemove] );
            delete coinElements[keyToRemove];
          })




        function popup(){
            if(localStorage.getItem('logged') != 'no'){
                openModal()
            }
        }

        //place first coin
        placeCoin()
        loadMessages()
        makeBoss()
        popup()
        startClock(moveArmy, 1000)
    }


    firebase.auth().onAuthStateChanged((user) => {
        if(user){
            // Logged In!
            playerId = user.uid
            playerRef = firebase.database().ref(`players/${playerId}`)

            const name = createName()
            playerNameInput.value = name
            const {x, y} = getRandomSafeSpot()

            playerRef.set({
                id: playerId,
                name,
                direction: "right",
                color: randomFromArray(playerColors),
                x,
                y,
                coins: 0,
                mana: 0,
                health: 100,
                collide: true,
                states: [""],
                weapon: "1" ,
                map: "map"
            })
            
            playerRef.onDisconnect().remove()

            initGame()
        }else{
        }
    })
}())
