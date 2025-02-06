import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // vectores
    const camPos = new THREE.Vector3(-10, 0, 50);

    // escena
    const scene = new THREE.Scene();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // camara
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(camPos.x, camPos.y, camPos.z);

    // fuentes de luz
    const light = new THREE.PointLight();
    light.intensity = 5;
    light.decay = 0;
    light.position.set(0, 0, 10);

    // modelos 
    const modelUrl = "../models/iss.dae";
    let iss;

    const loadingManager = new THREE.LoadingManager(() => {

        scene.add(iss);
        console.log('Model loaded');
        renderer.render(scene, camera);
    });

    const loader = new ColladaLoader(loadingManager);
    loader.load(modelUrl, (collada) => {

        iss = collada.scene;
        iss.scale.x = iss.scale.y = iss.scale.z = 0.3;
        iss.rotation.set(Math.PI / 5, Math.PI / 5, 0);
        iss.updateMatrix();
    });

    scene.add(light);
    renderer.render(scene, camera);

    // eventos
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);

    // inicio del loop de animacion
    //requestAnimationFrame(animate);
}

