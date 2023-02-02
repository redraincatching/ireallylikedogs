const functions = require("firebase-functions");
let admin = require("firebase-admin");
let serviceAccount = require("./test-project-3d277-firebase-adminsdk-qfyec-e57396a808.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

//replace everything in the {} for the formats

//register an account on the DB
//FORMAT: URL...?uname={uname}&id={id}&email={email}&password={password}
exports.registerAccount = functions.https.onRequest(async (req, res) => {
  //get variables
  const newUname = req.query.uname;
  //TODO: implement auto id counter
  const newID = req.query.id;
  const newEmail = req.query.email;
  const pswd = req.query.password;

  //access the Accounts collection and add the required info under the username
  await db.collection("Accounts").doc(newUname).set({
    id: newID,
    email: newEmail,
    password: pswd
  }).then(() => {
    //initialise the Profile for the user - this can be anything
    db.collection("Profiles").doc(newID).set({
      username: newUname,
      pfp: "Not Set",
    });
    res.json({ result: `Created account for username ${newUname}` });
  });
});

//function to login - temporary until firebase auth is set up
//successful login should be followed with a call to getProfileInfo
//FORMAT: URL...?username={username}&password={password}
exports.login = functions.https.onRequest(async (req, res) => {
  //get variables
  const uname = req.query.username;
  const pswd = req.query.password;

  //access the account and check the password is correct
  await db.collection("Accounts").doc(uname).get().then((docsnap) => {
    if (docsnap.exists) {
      if (docsnap.data()["password"] == pswd) {
        res.json({ result: "login successful", bool: true });
      }
      else {
        res.json({ result: "incorrect username for password", bool: false});
      }
    }
    else {
      res.json({ result: "user does not exist", bool: false });
    }
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
//FORMAT: URL...?uname={uname}
exports.getID = functions.https.onRequest(async (req, res) => {
  //access the document relating to the 
  const ret = await db.collection("Accounts").doc(req.query.uname).get().then((docSnap) => {
    if (docSnap.exists) {
      return docSnap.data()["id"];
    }
    else {
      return `Failed to find user ${req.query.uname}`;
    }
  });
  res.json(ret);
});

//function to provide all the profile info, or just one field, based on the input
//FORMAT: URL...?id={id}&field={field}
//for all info the field should be null without quotes
exports.getProfileInfo = functions.https.onRequest(async (req, res) => {
  //get the variables
  const id = req.query.id;
  const field = req.query.field;

  //access the appropriate document in the profiles collection
  const ret = await db.collection("Profiles").doc(id).get().then((docSnap) => {
    if (docSnap.exists) {
      //return the entire profile if the field is null, otherwise return the desired field
      if(field == null){
        return docSnap.data();
      }
      else{
        const data = docSnap.data()[field];
        return data == null ? "Unknown Field" : data;
      }
    }
  });
  res.json(ret);
});
