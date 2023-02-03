const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

var modal = document.getElementById("myModal"); // Get the modal
var btn = document.getElementById("myBtn"); // Get the button that opens the modal
var span = document.getElementsByClassName("close")[0]; // Get the <span> element that closes the modal

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
  modal1.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

span.onclick = function() {
  modal.style.display = "none";
}

function closesignin(){
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
var modal1 = document.getElementById("myModal1");
var btn1 = document.getElementById("myBtn1"); // Get the button that opens the modal
var span1 = document.getElementsByClassName("close1")[0]; // Get the <span> element that closes the modal

// When the user clicks the button, open the modal 
btn1.onclick = function() {
  modal1.style.display = "block";
  modal.style.display = "none";
}


// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal1.style.display = "none";
}

span1.onclick = function() {
  modal1.style.display = "none";
}

function closesignin1(){
  modal1.style.display = "none";
}

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase again!");
});

exports.isLoggedIn = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Not logged in");
});

exports.echo = functions.https.onRequest((request, response) => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("The data passed in is " + request.query.data);
});

// Accept comment and return the same comment to the user
exports.postcomment = functions.https.onRequest((request, response) => {
    // 1. Receive comment data in here from user POST request
    // 2. Connect to our Firestore database
    const currentTime = admin.firestore.Timestamp.now();
    request.body.timestamp = currentTime;

    return admin.firestore().collection('comments').
    add(request.body).then(()=>{
        response.send("Saved in the database");
    });

});

exports.getcomments = functions.https.onRequest((request, response) => {

    // 1. Connect to our Firestore database
    let myData = [];
    return admin.firestore().collection('comments').orderBy('timestamp').get().then((snapshot) => {

        if (snapshot.empty) {
            console.log('No matching documents.');
            response.send('No data in database');
            return;
        }

        snapshot.forEach(doc => {
            myData.push(doc.data());
        });

        // 2. Send data back to client
        response.send(myData);
    })
});
