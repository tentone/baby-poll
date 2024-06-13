<script setup>
  import { Config } from '../config.js';
  import {getLocale} from '../locale.js'
  import { ref } from 'vue'
  import Particles from '../components/Particles.vue'

  let boyCount = ref(0);
  let girlCount = ref(0);

  const boyBar = ref(null);
  const girlBar = ref(null);

  async function getResults() {
    const response = await fetch('http://' + Config.api + '/results', {method: 'GET'});
    const data = await response.json();

    console.log('Received results from API', data);

    const boy = data.boy;
    const girl = data.girl;


    if(boyBar.value) {
      boyBar.value.style.width = Math.ceil((boy > 0 ? boy / (boy + girl) : 0) * 100) + '%';
    }

    if(girlBar.value) {
      girlBar.value.style.width = Math.ceil((girl > 0 ? girl / (boy + girl) : 0) * 100) + '%';
    }

    boyCount.value=data.boy;
    girlCount.value=data.girl;

    setTimeout(getResults, 1000);
  }

  getResults();

</script>

<style scoped>
  .title {
    font-size: 30px;
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
</style>

<template>
  <div class="container">
    <div class="title">{{getLocale("results")}}</div>

    <!-- Boy -->
    <div style="display:flex; flex-direction: row; gap: 30px;">
      <!-- Gender indicator-->
      <div style="background-color: var(--white-dirty); border-radius: 50%; width: 100px; height: 100px;">
        <div style="display: flex; align-items: center;  justify-content: center; background-color: var(--white); border-radius: 50%; width: 100px; height: calc(100px - 10px); ">
          <img style="width: 60%; height: 60%; object-fit: contain;" src="../assets/male.svg"/>
        </div>
      </div>
      
      <!-- Progress bar -->
      <div style="width: 400px; height: 80px;">
        <div ref="boyBar" style="height: 80px; background-color: var(--blue-hover); border-radius: 15px;">
          <div style="display:flex; align-items: center; justify-content: center; width: 100%; height: calc(100% - 5px); background-color: var(--blue); border-radius: 15px;">
            <div class="result-text">{{boyCount}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Girl -->
    <div style="display:flex; flex-direction: row; gap: 30px;">
      <!-- Gender indicator-->
      <div style="background-color: var(--white-dirty); border-radius: 50%; width: 100px; height: 100px;">
        <div style="display: flex; align-items: center;  justify-content: center; background-color: var(--white); border-radius: 50%; width: 100px; height: calc(100px - 10px); ">
          <img style="width: 60%; height: 60%; object-fit: contain;" src="../assets/female.svg"/>
        </div>
      </div>
      
      <!-- Progress bar -->
      <div style="width: 400px; height: 80px;">

        <div ref="girlBar" style="height: 80px; background-color: var(--pink-hover); border-radius: 15px;">
          <div style="display:flex; align-items: center; justify-content: center; width: 100%; height: calc(100% - 5px); background-color: var(--pink); border-radius: 15px;">
            <div class="result-text">{{girlCount}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Particles/>
</template> 

