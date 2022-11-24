let admin = require("firebase-admin");
let serviceAccount = require("./TestProj/test-project-3d277-firebase-adminsdk-qfyec-d57e273027.json");
let SpotifyWebApi = require('spotify-web-api-node');
let spotifyApi = new SpotifyWebApi();

//line to test git commit

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

module.exports = { registerAccount, updateProfile, getID, getProfileInfo, getArtistIDs };

//register a new account in the database
async function registerAccount(newUname, newID, newEmail) {
    const res = await db.collection("Accounts").doc(newUname).set({
        id: newID,
        email: newEmail
    }).then(() => {
        //initialise the Profile for the user
        db.collection("Profiles").doc(newID).set({
            name: null,
            dob: null,
            bio: null,
            timeonplatform: Date.now()
        });
    })
    console.log("Registered Account:" + res);
}

//write account data - profile info (given id, write value to field)
async function updateProfile(id, field, value) {
    const profileRef = db.collection("Profiles").doc(id);
    await profileRef.get().then((docSnap) => {
        if (docSnap.exists) {
            let updateData = {};
            updateData[field] = value;
            profileRef.update(updateData).then(() => {
                console.log(`Updated data regarding ${field} with ${value}`);
            });
        }
        else {
            console.log("Failed to find document");
        }
    });
}

//receive account data - id
async function getID(uName) {
    const res = db.collection("Accounts").doc(uName).get().then((docSnap) => {
        if (docSnap.exists) {
            return docSnap.data()["id"];
        }
        else {
            return "Failed to find document";
        }
    })
    return res;
}

//receive account data - profile
async function getProfileInfo(id, field) {
    const res = db.collection("Profiles").doc(id).get().then((docSnap) => {
        if (docSnap.exists) {
            return field == null ? docSnap.data() : docSnap.data()[field];
        }
    });
    return res;
}

//get a list of artist IDs from a search
async function getArtistIDs(artistSearch) {
    spotifyApi.searchArtists(artistSearch)
        .then((data) => {
            console.log(`Search artists by "${artistSearch}"`, data.body);
        }, (err) => {
            console.error(err);
        });
}


//add artist links
//add artist info

//receive artist links
//receive artist info
