firebase.auth().signInAnonymously().catch((error) => {
    var errorCode = error.code
    var errorMessage = error.message

    console.log(errorCode, errorMessage)
})