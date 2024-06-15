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
    methods: {
      canvasInited: function (canvas) {
        this.createProton(canvas);
      },

      canvasResize: function ({ width, height }) {
        for (const behaviour of this.crossZoneBehaviours) {
            behaviour.zone.width = width + 100;
            behaviour.zone.height = height + 100;
        }
 
        this.proton.renderers[0].resize(width, height);
      },

      createProton(canvas) {
        const width = canvas.width;
        const height = canvas.height;
        const proton = new Proton();
        
        const createEmitter = (color, count) => {
            const emitter = new Proton.Emitter();
            emitter.damping = 0.008;
            emitter.rate = new Proton.Rate(count);
            emitter.addInitialize(new Proton.Mass(1));
            emitter.addInitialize(new Proton.Radius(5, 9));
            emitter.addInitialize(
            new Proton.Velocity(
                new Proton.Span(1.5),
                new Proton.Span(0, 360),
                "polar"
            )
            );

            emitter.addInitialize(new Proton.Position(new Proton.RectZone(0, 0, width, height)));
            const crossZoneBehaviour = new Proton.CrossZone(new Proton.RectZone(-50, -50, canvas.width + 100, canvas.height + 100),"bound");
            emitter.addBehaviour(new Proton.Color(color));
            emitter.addBehaviour(crossZoneBehaviour);
            emitter.addBehaviour(new Proton.RandomDrift(15, 15, 0.05));
            emitter.emit("once");

            return {emitter: emitter, crossZoneBehaviour: crossZoneBehaviour};
        };

        this.crossZoneBehaviours = [];

        if (Config.coloredSperm) {
          const a = createEmitter(CSSUtils.getVariable("--pink"), Config.spermCount / 2);
          proton.addEmitter(a.emitter);

          const b = createEmitter(CSSUtils.getVariable("--blue"), Config.spermCount / 2);
          proton.addEmitter(b.emitter);

          this.crossZoneBehaviours = [a.crossZoneBehaviour, b.crossZoneBehaviour];
        } else {
          const a = createEmitter(CSSUtils.getVariable("--white", Config.spermCount));
          proton.addEmitter(a.emitter);
          this.crossZoneBehaviours = [a.crossZoneBehaviour];
        }

   
        proton.addRenderer(this.createRenderer(canvas));

        
        this.proton = proton;
      },
      createRenderer(canvas) {
        const tailSize = 12;
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
            context.lineWidth = linearEvaluation(i, l) * 2.0;
            context.lineTo(x, y);
            context.stroke();
          }
        };
        
        // Linear evaluation for the tail width
        const linearEvaluation = (i, l) => {
          if (l <= 2) return 1;
  
          const max = 6;
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
    beforeDestory() {
      try {
        this.proton.destroy();
        RAFManager.remove(this.renderProton);
      } catch (e) {}
    },
  };
  </script>
  