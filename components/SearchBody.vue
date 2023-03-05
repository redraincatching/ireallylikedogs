<script>
import app from "../../api/firebase";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";

export default {
  props: {
    clientId: "2165473919fe4b0891ac4becaa5866ee",
    clientSecret: "b78f201d7bc747a2ba335c1d694d27ce",
  },
  data() {
    return {
      token: "",
      input: "",
    }
  },
  created() {
    //get a new token for spotify requests
    const functions = getFunctions(app);

    //TODO: remove emulator connection on prod
    connectFunctionsEmulator(functions, "localhost", 5001);
    //define function
    const getToken = httpsCallable(functions, "getSpotifyToken");

    //send request
    getToken().then((res) => {
      console.log(res);
      this.token = res.data.access_token;
      console.log(this.token);
    }).catch((error) => {
      console.log(error);
    });
  },
  methods: {
      search(term) {
        const functions = getFunctions(app);
        console.log(term);
        //TODO: remove emulator connection on prod
        connectFunctionsEmulator(functions, "localhost", 5001);

        //define function
        const searchArtist = httpsCallable(functions, "searchArtist");

        //send request
        searchArtist({token: this.token, term: term, limit: 10}).then((res) => {
          console.log(res.data);
        }).catch((error) => {
          console.log(error);
        });
      }
  },
}
</script>

<template>
  <section id="SearchPage" class="SearchPage">

    <h2 class="center">
      <input v-model="input" @keyup="search(this.input)" placeholder="What artist do you want to see?" type="search"
        style="width:50%; height:50px; border">
    </h2><br>


    <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

  </section>
</template>

<style scoped>
.SearchPage {
  font-family: "Roboto", sans-serif;
  background-color: black;
  color: white;
  padding-top: 12.5%;
}

.center {
  position: absolute;
  top: 30%;
  width: 100%;
  text-align: center;
  font-size: 18px;
}
</style>