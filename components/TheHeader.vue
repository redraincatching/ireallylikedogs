<script>
import { app, setProfileInfo, getUID, setUID } from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { openModal, closeModal, startLoad, endLoad } from "../assets/js/frontendFunctions"

//get components
const auth = getAuth(app);
const functions = getFunctions(app);

//define the functions
const checkUname = httpsCallable(functions, "checkUniqueUsername");
const getEmail = httpsCallable(functions, "getEmail");
const register = httpsCallable(functions, "registerAccount");


//TODO: remove emulator line when deploying
// connectFunctionsEmulator(functions, "localhost", 5001);

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      isLoggedIn: false,
      loadingBar: "",
    }
  },
  created() {
    let listener = onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = user ? true : false;
    });

    //unhook listener
    listener();
  },
  computed: {
    checkLogin() {
      let listener = onAuthStateChanged(auth, (user) => {
        this.isLoggedIn = user ? true : false;
      });

      //unhook listener
      listener();
    }
  },
  methods: {

    opensignin() {
      openModal(0);
    },

    closesignin() {
      closeModal(0);
    },

    opensignup() {
      openModal(1);
    },

    closesignup() {
      closeModal(1);
    },

    isEmail(e) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e);
    },

    //get the email if the email is a username
    //otherwise just calls login
    //necessary to allow the promise to resolve from getEmail before trying to sign in to firebase
    beforeLogin() {
      startLoad(this);

      //regex test
      if (!this.isEmail(this.email)) {
        console.log("Not Email; Getting ID from Username");


        getEmail({ username: this.email }).then((res) => {
          console.log(res.data.body);
          switch (res.data.code) {
            case 0:
              this.username = this.email;
              this.email = res.data.body;
              this.login();
              break;
            case 1:
              console.log("User Does Not Exist");
              endLoad();
              break;
            default:
              console.log("Unknown Code Returned From Server");
              endLoad();
              break;
          }
        });
      }
      else {
        this.login();
      }
    },

    //login function
    login() {

      //sign in with firebase auth using email and password
      signInWithEmailAndPassword(auth, this.email, this.password).then((userCred) => {
        const user = userCred.user;
        setUID(user.uid);
        this.isLoggedIn = true;
        this.routeToAccount();
        this.closesignin(0); //close the sign in popup
        endLoad();
      }).catch((error) => {
        //handle the firebase errors
        switch (error.code) {
          case "auth/wrong-password":
            console.log("Incorrect Password");
            break;
          case "auth/user-not-found":
            console.log("Incorrect Username or Email");
            break;
          case "auth/missing-email":
            console.log("Please Enter Your Username or Email");
            break;
          default:
            console.log(error.code);
            console.log(error.message);
            break;
        }

        endLoad();
      });
    },

    //register an account
    //calls login after successful execution
    register() {
      endLoad();

      //dont run if the email is invalid
      if (!this.isEmail(this.email)) {
        console.log("invalid email");
        this.hideLoad();
        return;
      }

      if (this.username == "") {
        console.log("Enter a Username");
        this.hideLoad();
        return;
      }

      //check if the username is taken
      checkUname({ "username": this.username }).then((res) => {
        if (res.data.isTaken) {
          console.log(res.data.message);
          return;
        }
        else {
          console.log(res.data.message);
        }
        //create a user in firebaser
        createUserWithEmailAndPassword(auth, this.email, this.password).then((userCred) => {
          const user = userCred.user;

          //register function sets up the database for this users data
          register({ "id": user.uid, "username": this.username, "email": this.email }).then((res) => {
            console.log(res.data);
            this.closesignin(1);  //close the register popup
            this.login(); //log the user in
          });
        }).catch((error) => {
          //handle firebase errors
          if (error.code == "auth/email-already-in-use") {
            console.log("Email Taken");
          }
          else if (error.code == "auth/weak-password") {
            console.log("Weak Password");
          }
          else {
            console.log(error.code);
            console.log(error.message);
          }
        });
      }).catch((error) => {
        console.log(error);
        endLoad();
      });
    },

    routeToAccount() {
      console.log("Routing to", getUID() != "" ? getUID() : "Account Page");
      if (this.isLoggedIn && getUID() != "") {
        this.$router.push({ name: 'AccountPage', params: { uid: getUID() } });
      }
      else {
        this.$router.push({ path: '/Account/' });
      }
    },

    logout() {
      startLoad(this);
      auth.signOut();
      setUID("");
      this.isLoggedIn = false;
      setProfileInfo({});
      this.routeToAccount();
      endLoad();
    }
  }
}
</script>

<template>
  <div id="myModal" class="modal"> <!-- Sign in popup  -->
    <!-- Modal content -->
    <div style="align-items: center" class="modal-content">
      <span class="close" @click="closesignin()">&times;</span>
      <p style="font-size: 40px; color: white">Sign in</p>
      <label style="color: #949494;">Email or Username</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="email"><br>
      <label style="color: #949494;"> Password</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="password"><br>
      <a @click="beforeLogin()" class="btn-get-started">Sign in</a>
    </div>
  </div>

  <div id="myModal1" class="modal"> <!-- create account popup  -->
    <!-- Modal content -->
    <div style="align-items: center" class="modal-content">
      <span class="close" @click="closesignup()">&times;</span>
      <p style="font-size: 40px; text-align: center; color: white">Create account</p>
      <label style="color: #949494;">Email</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="email"><br>
      <label style="color: #949494;">Username</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="username"><br>
      <label style="color: #949494;">Password</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="password"><br>
      <a @click="register" class="btn-get-started">Create</a>
    </div>
  </div>


  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous">
  <meta charset="utf-8">
  <nav class="navbar navbar-expand-sm " aria-label="Third navbar example" style="background-color:black">
    <div class="container-fluid">
      <router-link to="/">

        <img src="../assets/img/cratedigger_banner.png" alt="Crate Digger" width="150" height="60"><!--Logo-->
      </router-link>

      <button style="background-color: grey" class="navbar-toggler" type="button" data-bs-toggle="collapse"
        data-bs-target="#navbarsExample03" aria-controls="navbarsExample03" aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarsExample03" style="text-align: center; margin-left:40%">
        <ul class="navbar-nav me-auto mb-2 mb-sm-0">
          <li class="nav-item" style="margin-right: 30px;">
            <router-link to="/">Home</router-link>
          </li>
          <li v-if="!this.isLoggedIn" class="nav-item" style="list-style-type: none; margin-right: 30px;"><a
              class="myBtn1" id="myBtn1" @click="opensignup()">Sign Up</a></li>
          <li v-if="!this.isLoggedIn" class="nav-item" style="list-style-type: none; margin-right: 30px;"><a class="myBtn"
              id="myBtn" @click="opensignin()">Login</a></li>
          <li v-if="this.isLoggedIn" class="nav-item" style="list-style-type: none; margin-right: 30px;"><a class="myBtn"
              id="myBtn" @click="logout()">Log Out</a></li>
          <li class="nav-item" style="margin-right: 30px;">
            <router-link to="/AboutUs">About Us</router-link>
          </li>
          <li class="nav-item" style="margin-right: 30px;">
            <router-link to="/Search">Search</router-link>
          </li>

          <li class="nav-item" @click="routeToAccount">
            <router-link to="">Account</router-link>
          </li>

        </ul>

      </div>
    </div>
  </nav>
</template>
<style scoped>
.nav-item {
  color: rebeccapurple;
}

.myBtn1 {
  list-style-type: none;
}

.header {
  z-index: 997;
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  background-color: black;
  list-style-type: none;
}

.navbar {
  padding: 20px 0;
}

.navbar a,
.navbar a:focus {
  display: flex;
  padding: 0 3px;
  font-family: "Roboto", sans-serif;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  color: #1DB954;

  text-transform: uppercase;

  transition: 0.3s;

}


.navbar a:hover {
  color: white;
}



.hero {
  background-color: black;
  padding-top: 12.5%;
}

.btn-get-started {
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 1px;
  display: inline-block;
  padding: 12px 40px;
  border-radius: 50px;
  transition: 0.5s;
  margin: 10px;
  color: white;
  text-decoration: none;
  border: 2px solid #1DB954;
}

.btn-get-started:hover {
  background: #1DB954;
  color: black
}


.heading:hover {
  color: #1DB954;
}

.services {
  color: white;
  background-color: black;
  background-size: cover;
  font-size: 14px;
  padding: 80px 0 60px 0;
  position: relative;
}

.section-header {

  padding-bottom: 7.5%;

  color: white;
}

.service-item {
  background-color: #262626;
}

.service-item:hover {
  color: #1DB954;
}

/* The Modal (background) */
.modal {

  display: none;
  /* Hidden by default */
  position: fixed;
  /* Stay in place */
  z-index: 1;
  /* Sit on top */
  padding-top: 10px;
  /* Location of the box */
  left: 0;
  top: 0;
  /*width: 100%; /* Full width */
  /*height: 100%; /* Full height */
  overflow: auto;
  /* Enable scroll if needed */
  /* background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.6);
  /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  align-items: left;
  width: 350px;
  height: 500px;
  background-color: #1a1a1a;
  margin: auto;
  padding: 5px;


}

/* The Close Button */
.close {
  position: relative;
  left: 40%;
  color: white;
  float: right;
  font-size: 32px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #1DB954;
  text-decoration: none;
  cursor: pointer;
}

.close1:hover,
.close1:focus {
  color: #1DB954;
  text-decoration: none;
  cursor: pointer;
}

/* .modal-content {
align-items: center;
width: 350px;
height: 450px;
background-color: #1a1a1a;
margin: auto;
padding: 10px;


} */
</style>