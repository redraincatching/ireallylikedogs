
<template>


    <header id="header" class="header d-flex align-items-center">
    <div class="container-fluid container-xl d-flex align-items-center justify-content-between">
   
<router-link to="/">
<img src="../assets/img/cratedigger_banner.png" alt="Crate Digger" width="150" height="60"><!--Logo-->
</router-link>

      
        <nav id="navbar" class="navbar">
       
    
        <router-link to="/">Home</router-link>&nbsp;&nbsp;&nbsp;
        <li><a class="myBtn1" id="myBtn1">Sign Up</a></li>&nbsp;&nbsp;&nbsp;
        <li><a class="myBtn" id="myBtn">Login</a></li>&nbsp;&nbsp;&nbsp;
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
</style>

<script>
export default {
        
}
</script>