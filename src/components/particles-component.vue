<template>
    <Canvas
      global-composite-operation="source-over"
      v-on:canvasInited="canvasInited"
      v-on:canvasResize="canvasResize"
      style="z-index: -1; position:absolute; top:0px; left:0px;"/>
  </template>
  
  <script>
  import { CSSUtils } from "../css";
  import Canvas from "./canvas-component.vue";
  import {Config} from "../config";
  import Proton from "proton-engine";
  import RAFManager from "raf-manager";
  
  export default {
    name: "Particles",
    components: {
      Canvas,
    },
    data() {
      return {
        canvas: null,
        crossZoneBehaviours: [],
        pendingReset: null,
      };
    },
    methods: {
      /**
       * Method called when the canvas is initialized.
       * 
       * @param canvas {HTMLCanvasElement}
       */
      canvasInited: function (canvas) {
        this.canvas = canvas;
        this.createProton(canvas);

        if (this.pendingReset) {
          this.resetSperm(this.pendingReset.boy, this.pendingReset.girl);
          this.pendingReset = null;
        }
      },

      /**
       * Resize the canvas and the cross zone behaviours.
       * 
       */
      canvasResize: function ({ width, height }) {
        for (const behaviour of this.crossZoneBehaviours) {
            behaviour.zone.width = width + 100;
            behaviour.zone.height = height + 100;
        }
 
        this.proton.renderers[0].resize(width, height);
      },

      /**
       * Create proton particle engine instance with emitters and renderers.
       * 
       * Emitters are created with a color and count, and added to the proton engine.
       * 
       * @param {HTMLCanvasElement} canvas
       */
      createProton(canvas, initialCounts = null) {
        const proton = new Proton();
        this.crossZoneBehaviours = [];

        const addEmitterToProton = (color, count) => {
          if (!count || count <= 0) {
            return;
          }

          const { emitter, crossZoneBehaviour } = this.buildEmitter(color, count);
          proton.addEmitter(emitter);
          this.crossZoneBehaviours.push(crossZoneBehaviour);
          emitter.emit("once");
        };

        if (Config.coloredSperm) {
          const boyCount = initialCounts ? (initialCounts.boy || 0) : 0;
          const girlCount = initialCounts ? (initialCounts.girl || 0) : 0;

          addEmitterToProton(CSSUtils.getVariable("--blue-mid"), boyCount);
          addEmitterToProton(CSSUtils.getVariable("--pink-mid"), girlCount);
        } else {
          const total = initialCounts ? (initialCounts.boy || 0) + (initialCounts.girl || 0) : 0;
          addEmitterToProton(CSSUtils.getVariable("--white"), total);
        }
   
        proton.addRenderer(this.createRenderer(canvas));

        
        this.proton = proton;
      },

      /**
       * Build an emitter with the shared setup used across the component.
       * 
       * @param color {string}
       * @param count {number}
       * @returns {{emitter: Proton.Emitter, crossZoneBehaviour: Proton.CrossZone}}
       */
      buildEmitter(color, count) {
        const emitter = new Proton.Emitter();
        emitter.damping = 0.005;
        emitter.rate = new Proton.Rate(count);
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Radius(5, 10));
        emitter.addInitialize(new Proton.Velocity(new Proton.Span(1.5), new Proton.Span(0, 360), "polar"));
        emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, this.canvas.width, this.canvas.height)));

        const crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(-50, -50, this.canvas.width + 100, this.canvas.height + 100), "bound");

        emitter.addBehaviour(new Proton.Color(color));
        emitter.addBehaviour(crossZoneBehaviour);
        emitter.addBehaviour(new Proton.RandomDrift(15, 15, 0.05));

        return { emitter, crossZoneBehaviour };
      },

      /**
       * Add sperm particles to the existing proton instance.
       * 
       * @param {{boy?: number, girl?: number}} counts
       */
      addSpermBatch(counts = {boy: 0, girl: 0}) {
        if (!this.proton || !this.canvas) {
          return;
        }

        if (Config.coloredSperm) {
          if (counts.boy > 0) {
            this.emitSperm(CSSUtils.getVariable("--blue-mid"), counts.boy);
          }

          if (counts.girl > 0) {
            this.emitSperm(CSSUtils.getVariable("--pink-mid"), counts.girl);
          }
        } else {
          const total = (counts.boy || 0) + (counts.girl || 0);
          if (total > 0) {
            this.emitSperm(CSSUtils.getVariable("--white"), total);
          }
        }
      },

      /**
       * Reset the proton instance with the provided counts.
       * 
       * @param boyCount {number}
       * @param girlCount {number}
       */
      resetSperm(boyCount = 0, girlCount = 0) {
        if (!this.canvas) {
          this.pendingReset = {boy: boyCount, girl: girlCount};
          return;
        }

        if (this.proton) {
          try {
            this.proton.destroy();
          } catch (e) {}
        }

        this.createProton(this.canvas, {boy: boyCount, girl: girlCount});
      },

      /**
       * Emits sperm particles with the given color and count.
       * 
       * @param color {string}
       * @param count {number}
       */
      emitSperm(color, count) {
        if (!this.canvas || !this.proton || !count || count <= 0) {
          return;
        }

        const { emitter, crossZoneBehaviour } = this.buildEmitter(color, count);
        this.proton.addEmitter(emitter);
        this.crossZoneBehaviours.push(crossZoneBehaviour);
        emitter.emit("once");
      },

      /**
       * Create a renderer for the proton engine.
       * 
       * @param canvas {HTMLCanvasElement} The canvas element to render to.
       */
      createRenderer(canvas) {
        const tailSize = 18;
        const tailFrameUpdate = 5;
        const context = canvas.getContext("2d");
        const renderer = new Proton.CanvasRenderer(canvas);
  
        renderer.onProtonUpdate = () => {
          context.clearRect(0, 0, canvas.width, canvas.height);
        };
  
        renderer.onParticleCreated = (particle) => {
          particle.data.points = [];
          particle.data.index = 0;
        };
        
        // Update 
        renderer.onParticleUpdate = (particle) => {
          drawSpermTail(particle);
          if (particle.data.index % tailFrameUpdate === 0) {
            addPosition(particle);
          }
          drawSpermHead(particle);
          particle.data.index++;
        };
        
        // Add extra data to particle
        const addPosition = (particle) => {
          particle.data.points.unshift(particle.p.y);
          particle.data.points.unshift(particle.p.x);
          if (particle.data.points.length > tailSize) {
            particle.data.points.pop();
            particle.data.points.pop();
          }
        };
        
        // Draw the head of the sperm
        const drawSpermHead = (particle) => {
          context.fillStyle = particle.color;
          context.beginPath();
          context.arc(particle.p.x, particle.p.y, particle.radius, 0, Math.PI * 2, true);
          context.closePath();
          context.fill();
        };
        
        // Draw the tail of the sperm, from the list of points
        const drawSpermTail = (particle) => {
          context.beginPath();
          context.strokeStyle = particle.color;
          context.moveTo(particle.p.x, particle.p.y);
          const l = particle.data.points.length;

          for (let i = 0; i < l; i += 2) {
            const x = particle.data.points[i];
            const y = particle.data.points[i + 1];
            context.lineWidth = linearEvaluation(i, l);
            context.lineTo(x, y);
            context.stroke();
          }
        };
        
        // Linear evaluation for the tail width
        const linearEvaluation = (i, l) => {
          if (l <= 2) {
            return 2.0;
          }
  
          const max = 12;
          const A = (max - 1) / (2 / l - 1);
          const B = 1 - A;
          const x = (i + 2) / l;

          let val = A * x + B;
          val = val >> 0;
  
          return val;
        };
  
        return renderer;
      },


      renderProton: function () {
        if (this.proton) {
          this.proton.update();
        }
      },
    },
    
    created() {
      RAFManager.add(this.renderProton);
    },

    /**
     * Destroy the proton engine and remove the render loop.
     */
    beforeDestory() {
      try {
        this.proton.destroy();
        RAFManager.remove(this.renderProton);
      } catch (e) {}
    },
  };
  </script>
  
