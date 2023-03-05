<script>
import app from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: "",
      loading: false,
      loadingBar: null,
      isLoggedIn: false,
    }
  },
  created() {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      this.isLoggedIn = user ? true : false;
    });
  },
  computed: {
    checkLogin() {
      const auth = getAuth(app);
      onAuthStateChanged(auth, (user) => {
        this.isLoggedIn = user ? true : false;
      });
    }
  },
  methods: {
    //closes the sign in or sign up pop ups
    //get an array of all the pop ups with the style of a user identifcation section
    //select the correct one based on the index (they will appear on the page in the order of their definitions in the html)
    closesignin(i) {
      let elms = document.querySelectorAll('.modal');
      elms[i].style.display = "none";
    },

    //opens the sign in or sign up pop ups
    //get an array of all the pop ups with the style of a user identifcation section
    //select the correct one based on the index 
    // (the popups will appear in the array in the order of their definitions in the html)
    opensignin(i) {
      let elms = document.querySelectorAll('.modal');
      elms[i].style.display = "flex";
    },

    //show the loading bar
    showLoad() {
      if (!this.loading) {
        this.loadingBar = this.$loading.show();
        this.loading = true;
      }
    },

    //hide the loading bar
    hideLoad() {
      this.loadingBar.hide();
      this.loading = false;
    },

    //get the email if the email is a username
    verifyEmail(){
      //regex test
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        console.log("Not Email; Getting ID from Username");
        
        const functions = getFunctions(app);

        //TODO: remove emulator line when deploying
        connectFunctionsEmulator(functions, "localhost", 5001);

        //define the function
        const getID = httpsCallable(functions, "getEmail");
  
        getID({username: this.email}).then((res) => {
          console.log(res.data);
          this.email = res.data.email;
        }).then(() => {
          this.login();
        });
      }
      else{
        this.login();
      }
    },

    //login function
    //works for email or username
    login() {
      this.showLoad(); //loading

      //get necessary components
      const auth = getAuth(app);
      const functions = getFunctions(app);

      //TODO: remove emulator line when deploying
      connectFunctionsEmulator(functions, "localhost", 5001);


      //sign in with firebase auth using email and password
      signInWithEmailAndPassword(auth, this.email, this.password).then((userCred) => {
        const user = userCred.user;

        //define getProfileInfo
        const getProfileInfo = httpsCallable(functions, "getProfileInfo");
        //get the profile information of the user once their are signed in
        //stored under the users id
        getProfileInfo({ "id": user.uid }).then((info) => {
          console.log(info.data);
          this.closesignin(0); //close the sign in popup
          this.$router.push({ path: '/AccountPage' });
          this.isLoggedIn = true;
          this.hideLoad();  //done loading
        }).catch((error) => {
          console.log(error);
          this.hideLoad();
        });
      });
    },

    //register an account
    //calls login after successful execution
    register() {
      this.showLoad();  //loading

      //get auth component
      const auth = getAuth(app);
      const functions = getFunctions(app);

      //TODO: remove emulator line when deploying
      connectFunctionsEmulator(functions, "localhost", 5001);

      //create a user in firebaser
      createUserWithEmailAndPassword(auth, this.email, this.password).then((userCred) => {
        const user = userCred.user;

        //define the register function
        const register = httpsCallable(functions, "registerAccount");

        //register function sets up the database for this users data
        register({ "id": user.uid, "username": this.username, "email": this.email }).then((result) => {
          console.log(result.data);
          this.closesignin(1);  //close the register popup
          this.login(); //log the user in
        });
      }).catch((error) => {
        console.log(error.code);
        console.log(error.message);
        this.hideLoad();  //done loading
      });
    },

    logout() {
      this.showLoad();
      const auth = getAuth(app);
      auth.signOut();
      this.isLoggedIn = false;
      this.hideLoad();
    }
  }
}
</script>

<template>
  <div id="myModal" class="modal"> <!-- Sign in popup  -->
    <!-- Modal content -->
    <div style="align-items: center" class="modal-content">
      <span class="close" @click="closesignin(0)">&times;</span>
      <p style="font-size: 40px; color: white">Sign in</p>
      <label style="color: #949494;">Email or Username</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="email"><br>
      <label style="color: #949494;"> Password</label>
      <input style="height: 40px; border-radius: 7.5px;" required v-model="password"><br>
      <a @click="verifyEmail()" class="btn-get-started">Sign in</a>
    </div>
  </div>

  <div id="myModal1" class="modal"> <!-- create account popup  -->
    <!-- Modal content -->
    <div style="align-items: center" class="modal-content">
      <span class="close" @click="closesignin(1)">&times;</span>
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
              class="myBtn1" id="myBtn1" @click="opensignin(1)">Sign Up</a></li>
          <li v-if="!this.isLoggedIn" class="nav-item" style="list-style-type: none; margin-right: 30px;"><a class="myBtn"
              id="myBtn" @click="opensignin(0)">Login</a></li>
          <li v-if="this.isLoggedIn" class="nav-item" style="list-style-type: none; margin-right: 30px;"><a class="myBtn"
              id="myBtn" @click="logout()">Log Out</a></li>
          <li class="nav-item" style="margin-right: 30px;">
            <router-link to="/AboutUs">About Us</router-link>
          </li>
          <li class="nav-item" style="margin-right: 30px;">
            <router-link to="/SearchPage">Search</router-link>
          </li>

          <li class="nav-item">
            <router-link to="/AccountPage">Account</router-link>
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