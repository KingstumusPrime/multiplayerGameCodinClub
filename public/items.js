var coins = {}
var coinElements = {}

function attemptGrabCoin(x, y) {
    const key = getKeyString(x, y);
    if (coins[key]) {
        // Remove this key from data, then uptick Player's coin count
        firebase.database().ref(`coins/${key}`).remove();
        playerRef.update({
        coins: players[playerId].coins + 1,
        })
    }
}

 // places coins around the map
 function placeCoin() {
    const {x, y} = getRandomSafeSpot()
    const coinRef = firebase.database().ref(`coins/${getKeyString(x, y)}`)
    coinRef.set({
        x,
        y,
    })

    const coinTimeouts = [2000, 3000, 4000, 5000]
    setTimeout(() => {
        placeCoin()
    }, randomFromArray(coinTimeouts))
}