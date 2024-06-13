<script setup>
  import {getLocale} from '../locale.js'
  import { Config } from '../config.js';
  import Particles from '../components/Particles.vue';
  import AWN from "awesome-notifications"

  let allowVote = true;
  let notifier = new AWN({enabled: false});
    
  async function vote(option) {
    
    if (!allowVote) {
      notifier.alert(getLocale("cannotVote"))
      return;
    }

    allowVote = false;

    const data = {
      vote: option
    };

    const req = fetch('http://' + Config.api + '/vote', {method: 'POST', headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }, body: JSON.stringify(data)})

    
    await notifier.asyncBlock(req, null, null, getLocale("sending"));
    notifier.success(getLocale("voteSubmitted"));

    setTimeout(() => {
      allowVote = true;
    }, Config.timeBetweenVotes * 1000);
  }
</script>

<style scoped>
  .title {
    font-size: 40px;
    font-weight: bold;
    color: var(--text);
  }

  .button-text {
    font-size: 30px;
    font-weight: normal;
    color: var(--text);
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 50px;
    height: 100%;
    width: 100%;
  }

  .button-group {
    display:flex;
    flex-direction: row;
    gap: 50px;
  }

  .button-container {
    display:flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .button {
    background-color: var(--white-dirty);
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }

  .button-shadow {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--white);
    border-radius: 50%;
    width: 100px;
    height: calc(100px - 10px);
  }

  .button-image {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }

</style>

<template>
  <div class="container">
    <div class="title">{{getLocale("boyOrGirl")}}</div>

    <div class="button-group">

    <!-- Boy -->
    <div @click="vote('boy')" class="button-container">
      <!-- Gender indicator-->
      <div class="button">
        <div class="button-shadow">
          <img class="button-image" src="../assets/male.svg"/>
        </div>
      </div>

      <!-- Text -->
      <div class="button-text">{{getLocale("boy")}}</div>
    </div>

    <!-- Girl -->
    <div @click="vote('girl')" class="button-container">
      <!-- Gender indicator-->
      <div class="button">
        <div class="button-shadow">
          <img class="button-image" src="../assets/female.svg"/>
        </div>
      </div>

      <!-- Text -->
      <div class="button-text">{{getLocale("girl")}}</div>
    </div>
  </div>
  </div>

  <Particles/>
</template> 

