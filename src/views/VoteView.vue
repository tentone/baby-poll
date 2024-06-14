<script setup>
  import {getLocale} from '../locale.js'
  import { Config } from '../config.js';
  import Particles from '../components/Particles.vue';
  import AWN from "awesome-notifications"

  let allowVote = true;
  let notifier = new AWN({enabled: false});

  async function vote(option) {
    await notifier.asyncBlock((async function() {
      if (!allowVote) {
        notifier.warning(getLocale("cannotVote"), {labels: {warning: getLocale("warning")}});
        return;
      }

      allowVote = false;

      const data = {
        vote: option
      };

      try {
        await fetch('http://' + Config.api + '/vote', {method: 'POST', headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, body: JSON.stringify(data)})

        notifier.success(getLocale("voteSubmitted"), {labels: {success: getLocale("success")}});

        setTimeout(() => {
          allowVote = true;
        }, Config.timeBetweenVotes * 1000);
      } catch {
        notifier.alert(getLocale("errorVoting"), {labels: {alert: getLocale("error")}});
        allowVote = true;
      }
    })(), null, null, getLocale("sending"));
  }

  function fullscreen() {
    document.documentElement.requestFullscreen();
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

  .fullscreen-button {
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 30px;
    height: 30px;
  }

</style>

<template>
  <div @click="fullscreen()" class="fullscreen-button">
    <img src="../assets/fullscreen.svg" style="width: 100%; height: 100%;"/>
  </div>

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

