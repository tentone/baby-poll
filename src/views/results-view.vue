<script setup>
  import {getLocale} from '../locale.js'
  import {ref, onMounted, onBeforeUnmount} from 'vue'
  import Fullscreen from '../components/fullscreen-component.vue';
  import Particles from '../components/particles-component.vue'

  let boyCount = ref(0);
  let girlCount = ref(0);

  let previousBoy = 0;
  let previousGirl = 0;
  let particlesReady = false;
  let pollTimeout = null;

  const particles = ref(null);
  const boyBar = ref(null);
  const girlBar = ref(null);

  const baseSound = new Audio(new URL('../assets/vote.mp3', import.meta.url).href);
  baseSound.preload = 'auto';

  function playVoteSound(times) {
    for (let i = 0; i < times; i++) {
      const sound = baseSound.cloneNode(true);
      sound.play().catch(() => {});
    }
  }

  async function getResults() {
    const response = await fetch(window.location.origin + '/results', {method: 'GET'});
    const data = await response.json();

    console.log('Received results from API', data);

    const boy = Number(data.boy || 0);
    const girl = Number(data.girl || 0);

    const newBoys = Math.max(0, boy - previousBoy);
    const newGirls = Math.max(0, girl - previousGirl);
    const hasDecreased = boy < previousBoy || girl < previousGirl;

    if(boyBar.value) {
      boyBar.value.style.width = Math.ceil((boy > 0 ? boy / (boy + girl) : 0.1) * 100) + '%';
    }

    if(girlBar.value) {
      girlBar.value.style.width = Math.ceil((girl > 0 ? girl / (boy + girl) : 0.1) * 100) + '%';
    }

    boyCount.value = boy;
    girlCount.value = girl;

    if (particles.value) {
      if (!particlesReady || hasDecreased) {
        particles.value.resetSperm(boy, girl);
        particlesReady = true;
      } else if ((newBoys + newGirls) > 0) {
        particles.value.addSpermBatch({boy: newBoys, girl: newGirls});
        playVoteSound(newBoys + newGirls);
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
    font-size: 40px;
    font-weight: bold;
    color: var(--text);
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    height: 100%;
    width: 100%;
  }

  .result-text {
    font-size: 40px;
    color: var(--white);
  }

  .gender-indicator {
    background-color: var(--white-dirty);
    border-radius: 50%;
    width: 100px;
    height: 100px;
  }

  .gender-indicator-shadow {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--white);
    border-radius: 50%;
    width: 100px;
    height: calc(100px - 10px); 
  }

  .gender-indicator-image {
    width: 60%;
    height: 60%;
    object-fit: contain;
  }

  .gender-progress-bar-container {
    width: 500px;
    height: 90px;
  }

  .gender-progress-bar {
    height: 90px;
    border-radius: 15px;
  }

  .gender-progress-bar-shadow {
    display:flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: calc(100% - 5px);
    border-radius: 15px;
  }

  .vote-button {
    cursor: pointer;
    position: absolute;
    bottom: 10px;
    left: 50px;
    width: 30px;
    height: 30px;
  }

</style>

<template>

  <router-link to="/vote" class="vote-button">
    <img src="../assets/vote.svg" style="width: 100%; height: 100%;"/>
  </router-link>

  <Fullscreen/>

  <div class="container">
    <div class="title">{{getLocale("results")}}</div>

    <!-- Boy -->
    <div style="display:flex; flex-direction: row; gap: 30px;">
      <!-- Gender indicator-->
      <div class="gender-indicator">
        <div class="gender-indicator-shadow">
          <img class="gender-indicator-image" src="../assets/male.svg"/>
        </div>
      </div>
      
      <!-- Progress bar -->
      <div class="gender-progress-bar-container">
        <div ref="boyBar" class="gender-progress-bar" style="background-color: var(--blue-hover);">
          <div class="gender-progress-bar-shadow" style="background-color: var(--blue);">
            <div class="result-text">{{boyCount}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Girl -->
    <div style="display:flex; flex-direction: row; gap: 30px;">
      <!-- Gender indicator-->
      <div class="gender-indicator">
        <div class="gender-indicator-shadow">
          <img class="gender-indicator-image" src="../assets/female.svg"/>
        </div>
      </div>
      
      <!-- Progress bar -->
      <div class="gender-progress-bar-container">
        <div ref="girlBar" class="gender-progress-bar" style="background-color: var(--pink-hover);">
          <div class="gender-progress-bar-shadow" style="background-color: var(--pink);">
            <div class="result-text">{{girlCount}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Particles ref="particles"/>
</template> 

