let functions = require("firebase-functions");
let admin = require("firebase-admin");
let cors = require("cors")({origin: true});
let serviceAccount = require("./test-project-3d277-firebase-adminsdk-qfyec-e57396a808.json");
let reqPromise = require('request-promise');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

//replace everything in the {} for the formats

//register an account on the DB
exports.registerAccount = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get variables
    const ID = req.body.data.id;
    const name = req.body.data.username;

    //initialise the Profile for the user - this can be anything
    db.collection("UserIDs").doc(`${name}`).set({
      id: ID
    }).then(
      db.collection("UserData").doc(`${ID}`).set({
        likedArtists: [],
        likedAlbums: [],
        id: ID
      })
    ).then(
      res.send({ result: "Created Account" })
    );
    
    return;
  });
});

//function to login - temporary until firebase auth is set up
//successful login should be followed with a call to getProfileInfo
exports.login = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get variables
    //accessing the request object from vue
    const uname = req.body.data.username;
    const pswd = req.body.data.password;
    const email = req.body.data.email;

    //access the account and check the password is correct
    db.collection("Accounts").doc(uname).get().then((docsnap) => {
      if (docsnap.exists) {
        if (docsnap.data()["password"] == pswd) {
          res.send({data: { result: "login successful", bool: true , username: uname}});
          return;
        }
        else {
          res.send({ result: "incorrect username for password", bool: false});
          return;
        }
      }
      else {
        res.send({ result: "user does not exist", bool: false, username: uname});
        return ;
      }
    });
  });
});

//update any part of a profile with a provided id, field and value
//FORMAT: URL...?id={id}&field={field}&value={value}
//^ must provide a valid ID
exports.updateProfile = functions.https.onRequest(async (req, res) => {
  //get variables
  const id = req.query.id;
  const field = req.query.field;
  const value = req.query.value;

  //get a reference to the profile
  const profileRef = db.collection("Profiles").doc(id);
  await profileRef.get().then((docSnap) => {
    if (docSnap.exists) {
      let updateData = {};  //create an empty object
      updateData[field] = value;  //assign the value to a field in the object

      //use a firebase feature to update the data
      //only updates based on matching fields, does not overwrite the entire document
      profileRef.update(updateData).then(() => {
        res.json({ result: `Updated data regarding ${field} with ${value}` });
      });
    }
    else {
      res.json({ result: "Failed to find document" });
    }
  });
});

//function dedicated to receiving an ID of a given username
exports.getID = functions.https.onRequest((req, res) => {
  cors(req, res, () => {    
    //access the document relating to the 
    db.collection("Accounts").doc(req.body.data.uname).get().then((docSnap) => {
      if (docSnap.exists) {
        res.send({data:{id: docSnap.data()["id"]}});
        return;
      }
      else {
        res.send({data: `Failed to find user ${req.body.data.uname}`});
        return;
      }
    });
  });
});

//function to provide all the profile info, or just one field, based on the input
//FORMAT: URL...?id={id}&field={field}
//for all info the field parameter should be left out
exports.getProfileInfo = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    //get the variables
    const id = req.body.data.id;
    const field = req.body.data.field;
  
    //access the appropriate document in the profiles collection
    db.collection("UserData").doc(`${id}`).get().then((docSnap) => {
      if (docSnap.exists) {
        //return the entire profile if the field is null, otherwise return the desired field
        if(field == null){
          res.send({data: docSnap.data()});
        }
        else{
          const data = docSnap.data()[field];
          if(data == null){
            res.send({data: "Unknown Field"});
          }
          else{
            res.send({data: data});
          }
        }
      }
    });
  });
});

//gets a new token
//the token will be in the response.data.access_token json header
exports.getSpotifyToken = functions.https.onRequest( (req, res) => {
  cors(req, res, () => {
    //client secret and id provided by spotify api
    const clientId = "2165473919fe4b0891ac4becaa5866ee";
    const clientSecret = "b78f201d7bc747a2ba335c1d694d27ce";

    //headers for POST request
    let _headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
    };

    //options for POST request
    let options = {
      method: 'POST',
      uri: 'https://accounts.spotify.com/api/token',
      body: 'grant_type=client_credentials',
      headers: _headers,
      json: true
    };
    
    //make the request and return the result
    //reqPromise is the 'request-promise' node package (used instead of fetch)
    reqPromise(options).then((result) => {
      //firebase requires the response to be sent under the data header
      res.send({data: result});
    }).catch((error) => {
      res.send({data: error});
    });
  });
});

//searches spotify for artists
//send request as {token: token, term: searchTerm, limit: limit}
exports.searchArtist = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    //get the variables
    const token = req.body.data.token;
    const term = req.body.data.term;
    const limit = req.body.data.limit;

    let options = {
      method: 'GET',
      uri: `https://api.spotify.com/v1/search?q=${term}&type=artist&limit=${limit}`,
      headers: {'Authorization': `Bearer ${token}`},
      json: true
    };

    //make the request
    reqPromise(options).then((result) => {
      res.send({data: result});
    }).catch((error) => {
      res.send({data: error});
    });
  });
});