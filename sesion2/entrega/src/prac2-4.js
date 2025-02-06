import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // escena
    const scene = new THREE.Scene();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // camara
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(0, 0, 250);

    // textures
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures
   
    const globeMapUrl = "../textures/tierra";   // The file used as texture
    const cloudsMapUrl = "../textures/nubes.png";   // The file used as texture
    const globeMap = textureLoader.load(globeMapUrl, (loaded) => { renderer.render(scene, camera); });
    const cloudsMap = textureLoader.load(cloudsMapUrl, (loaded) => { renderer.render(scene, camera); });

    // fuentes de luz
    const light = new THREE.PointLight();
    light.intensity = 5;
    light.decay = 0;
    light.position.set(0, 0, 150);

    // geometrias
    const globeGeo = new THREE.SphereGeometry(100, 100, 100);
    const cloudsGeo = new THREE.SphereGeometry(101, 100, 100);
    
    // materiales
    const globeMat = new THREE.MeshPhongMaterial(
        { map: globeMap }
    );
    const globe = new THREE.Mesh(globeGeo, globeMat);
    
    const cloudsMat = new THREE.MeshLambertMaterial(
        { color: 0xFFFFFF, map: cloudsMap, transparent: true }
    );
    const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);

    // jerarquia de objetos
    const earth = new THREE.Object3D();
    earth.add(globe);
    earth.add(clouds);

    // rotacion tierra
    earth.rotation.set(0, 0, 0.36);

    // aniadir objeto y renderizar
    scene.add(earth);
    scene.add(light);
    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}