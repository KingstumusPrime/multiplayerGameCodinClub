//Misc Helpers
function randomFromArray(array) {
    return array[Math.floor(Math.random() * array.length)]
}
function getKeyString(x, y){
    return `${x}x${y}`
}

function getRandomSafeSpot() {
    //We don't look things up by key here, so just return an x/y
    return randomFromArray([
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 2, y: 6 },
      { x: 2, y: 8 },
      { x: 2, y: 9 },
      { x: 4, y: 8 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 5, y: 10 },
      { x: 5, y: 11 },
      { x: 11, y: 7 },
      { x: 12, y: 7 },
      { x: 13, y: 7 },
      { x: 13, y: 6 },
      { x: 13, y: 8 },
      { x: 7, y: 6 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 8, y: 8 },
      { x: 10, y: 8 },
      { x: 8, y: 8 },
      { x: 11, y: 4 },
    ]);
  }


function createName() {
    const prefix = randomFromArray([
        "COOL",
        "SUPER",
        "HIP",
        "SMUG",
        "COOL",
        "SILKY",
        "GOOD",
        "SAFE",
        "DEAR",
        "DAMP",
        "WARM",
        "RICH",
        "LONG",
        "DARK",
        "SOFT",
        "BUFF",
        "DOPE"
    ])
    const animal = randomFromArray([
        "BEAR",
        "DOG",
        "CAT",
        "FOX",
        "LAMB",
        "LION",
        "BOAR",
        "VOLE",
        "SEAL",
        "PUMA",
        "MULE",
        "BULL",
        "BIRD",
        "BUG"
    ])
    return `${prefix} ${animal}`
}

function isSolid(x,y){
    const blockedNextSpace = mapData.blockedSpaces[getKeyString(x, y)]
    return (
        blockedNextSpace || x >= mapData.maxX || x < mapData.minX || y >= mapData.maxY || y < mapData.minY
    )
}

var boss = false
// Player colors in sprite order
const playerColors = ["blue", "red", "orange", "yellow", "green", "purple", "pink"]

function sinWave(time, a, f){
    return Math.sin(time * Math.PI * 2/f)
}

function weed(objs, prop, value) {
    let res = []
    Object.keys(objs).forEach((key) => {
        if(objs[key][prop] == value){
            res.push(objs[key])
        }
    })
    return res
}