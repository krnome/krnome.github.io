"use strict";

import {PerspectiveCamera, Scene, WebGLRenderer} from "./build/three.module.js";
import SolarSystem from "./SolarSystem.js";
import {VRButton} from './build/VRButton.js'

export default class App {
    constructor() {

        //Kamera og renderer må vite bredde og høyde for vinduet
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.aspect = this.width / this.height;

        //Kamera trenger å vite:
        this.fov = 75; //Field of view - hvor "bredt" skal kamera se?
        this.near = 0.1; //Hvor nærmt inntil kamera skal det tegnes?
        this.far = 1000; //Hvor langt vekk fra kamera skal det tegnes?

        //Oppretter instans av Three.js sitt PerspectiveCamera
        this.camera = new PerspectiveCamera(this.fov, this.aspect, this.near, this.far);
        

        //Oppretter Three.js scene objekt
        this.scene = new Scene();
        this.scene.add(this.camera);

        this.camera.position.z = 50; //Flytter kamera litt bakover fra midt i vår "verden"
        
        //Vi vil fortelle Three.js at vi vil bruke webgl2
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('webgl2');

        //Oppretter Three.js Renderer
        this.renderer = new WebGLRenderer({canvas: canvas, context: context});

        //Forteller renderer at den skal bruke svart farge til å male over når den skal begynne å tegne en ny frame
        this.renderer.setClearColor(0x000000);
        //Forteller renderer hvor stort vinduet er
        this.renderer.setSize(this.width, this.height);

        this.renderer.xr.enabled = true;

        //"Sender tilbake" canvas-elementet til index.html sin <body>
        document.body.appendChild(this.renderer.domElement);

        //Oppretter instans av SolarSystem vi har laget
        this.solarSystem = new SolarSystem(this.scene);

        document.body.append(VRButton.createButton(this.renderer));

        //Siste som skjer i constructor: Start render-loopen



        //this.render(); // <- Kaller ikke på render-funksjonen vår i constructor.
        //I stedet:
        this.renderer.setAnimationLoop(this.render.bind(this));

    }

    render(){
        //Animer solsystemet: flytt og roter planeter
        this.solarSystem.animate();

        //Ber Three.js sin renderer om å tegne scenen vår, fra kameraet vårt sitt perspektiv
        this.renderer.render(this.scene, this.camera);

        //VR: Bruker ikke window.requestAnimationFrame()
        //window.requestAnimationFrame(this.render.bind(this));
    }
}
