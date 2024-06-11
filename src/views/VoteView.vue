<script setup>
  import {getLocale} from '../locale.js'

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

</style>

<template>
  <div class="container">
    <div class="title">{{getLocale("boyOrGirl")}}</div>

    <div style="display:flex; flex-direction: row; gap: 30px;">
    <!-- Boy -->
    <div style="display:flex; flex-direction: column; align-items: center;">
      <!-- Gender indicator-->
      <div style="background-color: var(--white-dirty); border-radius: 50%; width: 100px; height: 100px;">
        <div style="display: flex; align-items: center;  justify-content: center; background-color: var(--white); border-radius: 50%; width: 100px; height: calc(100px - 10px); ">
          <img style="width: 60%; height: 60%; object-fit: contain;" src="../assets/male.svg"/>
        </div>
      </div>

      <!-- Text -->
      <div>{{getLocale("boy")}}</div>
    </div>

    <!-- Girl -->
    <div style="display:flex; flex-direction: column; align-items: center;">
      <!-- Gender indicator-->
      <div style="background-color: var(--white-dirty); border-radius: 50%; width: 100px; height: 100px;">
        <div style="display: flex; align-items: center;  justify-content: center; background-color: var(--white); border-radius: 50%; width: 100px; height: calc(100px - 10px); ">
          <img style="width: 60%; height: 60%; object-fit: contain;" src="../assets/female.svg"/>
        </div>
      </div>

      <!-- Text -->
      <div>{{getLocale("girl")}}</div>
    </div>
  </div>
  </div>
</template> 

