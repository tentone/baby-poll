<script setup>
  import {getLocale} from '../locale.js'
  import {Config} from '../config.js';
  import Particles from '../components/particles.vue';
  import Fullscreen from '../components/fullscreen.vue';
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
        vote: option,
        clientId: localStorage.getItem('clientId')
      };

      try {
        const response = await fetch('http://' + Config.api.address + ':' + Config.api.port + '/vote', {method: 'POST', headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }, body: JSON.stringify(data)})
        
        if (response.status !== 200) {
          notifier.alert(getLocale("errorVoting"), {labels: {alert: getLocale("error")}});
          allowVote = true;
        } else {
          notifier.success(getLocale("voteSubmitted"), {labels: {success: getLocale("success")}});
          setTimeout(() => {
            allowVote = true;
          }, Config.timeBetweenVotes * 1000);
        }


      } catch {
        notifier.alert(getLocale("noInternet"), {labels: {alert: getLocale("error")}});
        allowVote = true;
      }
    })(), null, null, getLocale("sending"));
  }

</script>

<style scoped>
  .title {
    font-size: 50px;
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
    height: 100%;
    width: 100%;
  }

  .button-group {
    display:flex;
    flex-direction: row;
  }

  .button-container {
    display:flex;
    flex-direction: column;
    align-items: center;
  }

  .button {
    background-color: var(--white-dirty);
    border-radius: 50%;
    width: 150px;
    height: 150px;
  }

  .button-shadow {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--white);
    border-radius: 50%;
    width: 150px;
    height: calc(150px - 10px);
  }

  .button-image {
    width: 50%;
    height: 50%;
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
  <Fullscreen/>

  <div class="container">
    <div class="title">{{getLocale("boyOrGirl")}}</div>

    <div style="height: 50px;"></div>
    <div class="button-group">
      <!-- Boy -->
      <div @click="vote('boy')" class="button-container">
        <!-- Gender indicator-->
        <div class="button">
          <div class="button-shadow">
            <img class="button-image" src="../assets/male.svg"/>
          </div>
        </div>

        <div style="height: 10px;"></div>

        <!-- Text -->
        <div class="button-text">{{getLocale("boy")}}</div>
      </div>

      <div style="width: 80px;"></div>

      <!-- Girl -->
      <div @click="vote('girl')" class="button-container">
        <!-- Gender indicator-->
        <div class="button">
          <div class="button-shadow">
            <img class="button-image" src="../assets/female.svg"/>
          </div>
        </div>
        <div style="height: 10px;"></div>
        <!-- Text -->
        <div class="button-text">{{getLocale("girl")}}</div>
      </div>
    </div>
  </div>



  <Particles/>
</template> 

