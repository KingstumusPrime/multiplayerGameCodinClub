// CONSTS
const closeModalBtn = document.querySelector(".close-button")
var modal = document.querySelector(".modal")
var gameContainer = document.querySelector(".game-container")
const playerNameInput = document.querySelector("#player-name")
var chatInput = document.querySelector("#chat-input")
var playerColorButton = document.querySelector("#player-color")
var weaponButton = document.querySelector("#player-weapon")


/// ***********************
//  MODAL
/// ***********************

// closes shop modal
function closeModal(){
    modal.classList.remove("active")
    overlay.classList.remove("active")
}

//opens shop modal
function openModal(){
    modal.classList.add("active")
    overlay.classList.add("active")
    chatInput.disabled = true
    Dwn.unbind()
    Up.unbind()
    Lft.unbind()
    Right.unbind()
}

// close modal by button
closeModalBtn.addEventListener("click", () => {
    closeModal()
    closeModalBtn.blur()
    Dwn.bind()
    Up.bind()
    Lft.bind()
    Right.bind()
    chatInput.disabled = false
    if(localStorage.getItem("loggedCastle") != "no"){
        localStorage.setItem("loggedCastle", "no")
    }
})  

/// ***********************
///  chat
/// ***********************
function loadMessages(){

    // load the last 12 messages and listen for more
    var query = firebase.firestore()
        .collection('messages')
        .orderBy('timestamp')
        .limit(1000);
    // listen for new messages
    query.onSnapshot(function(snapshot){
        snapshot.docChanges().forEach(function(change){
            if(change.type == "removed"){
            }if(change.type == "added"){
                var message = change.doc.data()
                chat.innerHTML += `<p><b>${message.name}</b>: ${message.text}</p>`
                chat.scrollTop = chat.scrollHeight;
            }

        })
    })
}

//save chat message
function saveMessage(messageText, player) {
    // Add a new message entry to the database.
    return firebase.firestore().collection('messages').add({
    name: players[playerId].name,
    text: messageText,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function(error) {
    console.error('Error writing new message to database', error);
    });
}

// new chat message
chatInput.addEventListener("change", (e) => {
    if(chatInput.value != ""){
        saveMessage(e.target.value)
        chatInput.value = ""
    }
})


// player name changed
playerNameInput.addEventListener("change", (e) => {
    const newName = e.target.value || createName()
    playerNameInput.value = newName
    playerRef.update({
        name: newName
    })
})
//update player color
playerColorButton.addEventListener("click", () => {
    const mySkinIndex = playerColors.indexOf(players[playerId].color)
    const nextColor = playerColors[mySkinIndex + 1] || playerColors[0]
    playerRef.update({
        color: nextColor
    })
})

weaponButton.addEventListener("click", () => {
    playerRef.update({
        weapon:randomFromArray(playerWeapons)
    }) 
})