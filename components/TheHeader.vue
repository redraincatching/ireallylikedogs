<script>
import app from "../../api/firebase";
import {getFunctions, httpsCallable} from "firebase/functions";

export default {
  data() {
    return {
      email: "",
      username: "",
      password: ""
    }
  },  
  methods: {
    closesignin(i) {
      let elms = document.querySelectorAll('.modal');
      elms[i].style.display = "none";
    },
  
    opensignin(i){
      let elms = document.querySelectorAll('.modal');
      elms[i].style.display = "flex";
    },

    login(){
      const functions = getFunctions(app);
      const login = httpsCallable(functions, "login");
      login({"uname": this.username, "pswd": this.password}).then((result) => {
        console.log(result);
        this.closesignin(0);
      });
    },

    register(){

    }
  }
}
</script>

<template>


    <header id="header" class="header d-flex align-items-center">
    <div class="container-fluid container-xl d-flex align-items-center justify-content-between">
   

      <div id="myModal" class="modal"> <!-- Sign in popup  -->
  <!-- Modal content -->
  <div class="modal-content">
    <span class="close" @click="closesignin(0)">&times;</span>
    <p style="font-size: 40px;">Sign in</p>
    <label style="color: #949494;">Username</label>
    <input style="height: 40px; border-radius: 7.5px;" required v-model="username"><br>
    <label style="color: #949494;"> Password</label>
    <input style="height: 40px; border-radius: 7.5px;" required v-model="password"><br>
    <a @click="login" class="btn-get-started">Sign in</a>
  </div>
</div>

<div id="myModal1" class="modal"> <!-- create account popup  -->
    <!-- Modal content -->
    <div class="modal-content" style="height:545px">
      <span class="close" @click="closesignin(1)">&times;</span><br><br>
      <p style="font-size: 40px;">Create account</p>
      <label style="color: #949494;" >Email</label><br>
      <input style="height: 40px; border-radius: 7.5px;"  required v-model="email"><br><br>
      <label style="color: #949494;" >Username</label><br>
      <input style="height: 40px; border-radius: 7.5px;"  required v-model="username"><br><br>
      <label style="color: #949494;">Password</label><br>
      <input style="height: 40px; border-radius: 7.5px;"  required v-model="password"><br><br>
      <a @click="register" class="btn-get-started">Create</a>
    </div>
  </div>

<router-link to="/">
<img src="../assets/img/cratedigger_banner.png" alt="Crate Digger" width="150" height="60"><!--Logo-->
</router-link>

      
        <nav id="navbar" class="navbar">
       
    
        <router-link to="/">Home</router-link>&nbsp;&nbsp;&nbsp;
        <li><a class="myBtn1" id="myBtn1" @click="opensignin(1)">Sign Up</a></li>&nbsp;&nbsp;&nbsp;
        <li><a class="myBtn" id="myBtn" @click="opensignin(0)">Login</a></li>&nbsp;&nbsp;&nbsp;
        <router-link to="/AboutUs">About Us</router-link>&nbsp;&nbsp;&nbsp;
        <router-link to="/SearchPage">Search</router-link>&nbsp;&nbsp;&nbsp;
        <router-link to="/AccountPage">Account</router-link>
        </nav>
        </div>
        </header>
        
  
</template>
<style scoped>

.header{
z-index: 997;
  position: absolute;
  padding: 30px 0;
  top: 0;
  left: 0;
  right: 0;
  background-color: black;
  list-style-type: none;
}
.navbar {
    padding: 0;
  }

.navbar ul {
        list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    list-style: none;
    align-items: center;
  }
.navbar li {
    position: relative;
  }

  .navbar>ul>li {
    white-space: nowrap;
    padding: 10px 0 10px 28px;
  }

  .navbar a,
  .navbar a:focus {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 3px;
    font-family: "Roboto", sans-serif;
    font-size: 20px;
    font-weight: 500;
    text-decoration: none;
    color: #1DB954;

    text-transform: uppercase;
    white-space: nowrap;
    transition: 0.3s;
    position: relative;
  }

  .navbar a i,
  .navbar a:focus i {
    font-size: 22px;
    line-height: 0;
    margin-left: 5px;
  }

  .navbar>ul>li>a:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -6px;
    left: 0;
    background-color: black;
    visibility: hidden;
    width: 0px;
    transition: all 0.3s ease-in-out 0s;
  }

  .navbar a:hover:before,
  .navbar li:hover>a:before,
  .navbar .active:before {
    visibility: visible;
    width: 100%;
  }

  .navbar a:hover,
  .navbar .active,
  .navbar .active:focus,
  .navbar li:hover>a {
    color: white;
  }

  .navbar .dropdown ul {
    display: block;
    position: absolute;
    left: 28px;
    top: calc(100% + 30px);
    margin: 0;
    padding: 10px 0;
    z-index: 99;
    opacity: 0;
    visibility: hidden;
    background: #fff;
    box-shadow: 0px 0px 30px rgba(127, 137, 161, 0.25);
    transition: 0.3s;
  }

  .navbar .dropdown ul li {
    min-width: 200px;
  }

  .navbar .dropdown ul a {
    padding: 10px 20px;
    font-size: 15px;
    text-transform: none;
    color: var(--color-default);
    font-weight: 400;
  }

  .navbar .dropdown ul a i {
    font-size: 12px;
  }

  .navbar .dropdown ul a:hover,
  .navbar .dropdown ul .active:hover,
  .navbar .dropdown ul li:hover>a {
    color: var(--color-primary);
  }

  .navbar .dropdown:hover>ul {
    opacity: 1;
    top: 100%;
    visibility: visible;
  }

  .navbar .dropdown .dropdown ul {
    top: 0;
    left: calc(100% - 30px);
    visibility: hidden;
  }

  .navbar .dropdown .dropdown:hover>ul {
    opacity: 1;
    top: 0;
    left: 100%;
    visibility: visible;
  }

@media (min-width: 1280px) and (max-width: 1366px) {
  .navbar .dropdown .dropdown ul {
    left: -90%;
  }

  .navbar .dropdown .dropdown:hover>ul {
    left: -100%;
  }
}

@media (min-width: 1280px) {

  .mobile-nav-show,
  .mobile-nav-hide {
    display: none;
  }
}

.hero{
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


.heading:hover{
  color: #1DB954;
}

.services{
  text-align: center;
  
  color: white;
  background-color:black;
  background-size: cover;
  font-size: 14px;
  padding: 80px 0 60px 0;
  position: relative;
}

.section-header {
  text-align: center;
  padding-bottom: 7.5%;

  color: white;
}

.service-item {
  background-color: #262626;
}

.service-item:hover{
  color: #1DB954;
}
  
  /* The Modal (background) */
  .modal {
    
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 150px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    /* background-color: rgb(0,0,0); /* Fallback color */
    background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
  }
  
  /* Modal Content */
  .modal-content {
      align-items: left;
      width: 350px;
      height: 450px;
    background-color: #1a1a1a;
    margin: auto;
    padding: 15px;
  
   
  }
  
  /* The Close Button */
  .close {
      position: relative;
      left: 40%;
    color: #262626;
    float: right;
    font-size: 32px;
    font-weight: bold;
  }
  
  .close:hover,
  .close:focus {
    color: #BFB1A4;
    text-decoration: none;
    cursor: pointer;
  }

.close1:hover,
.close1:focus {
color: #BFB1A4;
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