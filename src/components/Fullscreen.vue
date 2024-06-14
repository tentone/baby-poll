<script setup>
  function fullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
</script>
  
<style scoped>
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
</template>
