<script setup>
  import {getLocale} from '../locale.js'
  import {Config} from '../config.js';
  import {ref, onMounted, onBeforeUnmount} from 'vue'
  import Particles from '../components/particles-component.vue';
  import Fullscreen from '../components/fullscreen-component.vue';
  import AWN from "awesome-notifications"

  let boyCount = ref(0);
  let girlCount = ref(0);

  let previousBoy = 0;
  let previousGirl = 0;
  let particlesReady = false;
  let pollTimeout = null;

  const particles = ref(null);

  /**
   * Flag to control if the user can vote or not.
   * 
   * This is used to prevent multiple votes in a short period of time.
   */
  let allowVote = true;

  /**
   * Notification manager.
   */
  let notifier = new AWN({enabled: false});

  /**
   * Vote for an option and send the vote to the API.
   */
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
        const response = await fetch(window.location.origin + '/api/vote', {method: 'POST', headers: {
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

  /**
   * Get the results from the API and update the view.
   * 
   * Used to update the background particles with the current vote counts.
   */
  async function getResults() {
    const response = await fetch(window.location.origin + '/api/results', {method: 'GET'});
    const data = await response.json();

    const boy = Number(data.boy || 0);
    const girl = Number(data.girl || 0);

    const newBoys = Math.max(0, boy - previousBoy);
    const newGirls = Math.max(0, girl - previousGirl);
    const hasDecreased = boy < previousBoy || girl < previousGirl;

    boyCount.value = boy;
    girlCount.value = girl;

    if (particles.value) {
      if (!particlesReady || hasDecreased) {
        particles.value.resetSperm(boy, girl);
        particlesReady = true;
      } else if ((newBoys + newGirls) > 0) {
        particles.value.addSpermBatch({boy: newBoys, girl: newGirls});
      }
    }

    previousBoy = boy;
    previousGirl = girl;

    pollTimeout = setTimeout(getResults, 1000);
  }

  onMounted(() => {
    getResults();
  });

  onBeforeUnmount(() => {
    if (pollTimeout) {
      clearTimeout(pollTimeout);
    }
  });
</script>

<style scoped>
  .title {
    font-size: 50px;
    font-weight: bold;
    color: var(--text);
    text-shadow: 0px 3px 2px var(--white);
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

  .results-button {
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    left: 50px;
    width: 30px;
    height: 30px;
  }

</style>

<template>
  <router-link to="/results" class="results-button">
    <img src="../assets/bar-chart.svg" style="width: 100%; height: 100%;"/>
  </router-link>

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



  <Particles ref="particles"/>
</template> 

