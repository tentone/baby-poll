<script setup>
  import {Locale, getLocale} from '../locale.js'

</script>

<style>
  .title {
    font-size: 30px;
    color: var(--text);
  }
</style>

<template>
  <div style="display:flex; flex-direction: column">
    <div class="title">{{getLocale("results")}}</div>
    <div>{{Locale.en.home}}</div>
  </div>
</template> 

