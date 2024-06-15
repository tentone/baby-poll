<script setup>
  async function fullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) {
      alert('Error toggling fullscreen' + e);
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
