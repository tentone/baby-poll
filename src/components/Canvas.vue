<template>
    <canvas class="canvas" ref="canvasRef" />
</template>
  
<style scoped>
  .canvas {
    width: 100%;
    height: 100%;
    display: block;
    background-color: var(--background);
  }
</style>
  

  <script>
  export default {
    name: "Canvas",
    props: {
      globalCompositeOperation: String
    },
    methods: {
      initCanvas: function() {
        const canvas = this.$refs.canvasRef;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
  
        if (this.globalCompositeOperation) {
          const context = canvas.getContext("2d");
          context.globalCompositeOperation = this.globalCompositeOperation;
        }
  
        this.$emit("canvasInited", canvas);
      },
      resize: function() {
        const canvas = this.$refs.canvasRef;
        const width = window.innerWidth;
        const height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
  
        this.$emit("canvasResize", { width, height });
      },
    },
    mounted() {
      this.initCanvas();
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
    },
    beforeDestory() {
      window.removeEventListener("resize", this.resize);
    }
  };
  </script>
  
