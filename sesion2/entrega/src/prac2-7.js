import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // escena
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // camara
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(-10, 0, 0);
    camera.rotation.set(0, -0.5 * Math.PI, 0)

    // textures
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures

    const globeMapUrl = "../textures/tierra";   // The file used as texture
    const cloudsMapUrl = "../textures/nubes.png";   // The file used as texture
    const moonMapUrl = "../textures/luna";   // The file used as texture
    const globeMap = textureLoader.load(globeMapUrl, (loaded) => { renderer.render(scene, camera); });
    const cloudsMap = textureLoader.load(cloudsMapUrl, (loaded) => { renderer.render(scene, camera); });
    const moonMap = textureLoader.load(moonMapUrl, (loaded) => { renderer.render(scene, camera); })

    // fuentes de luz
    const light = new THREE.PointLight();
    light.intensity = 5;
    light.decay = 0;
    light.position.set(0, 0, 150);

    const auxLightEjercicio5 = new THREE.PointLight();
    auxLightEjercicio5.intensity = 5;
    auxLightEjercicio5.decay = 0;
    auxLightEjercicio5.position.set(-1000, 0, 0);
    scene.add(auxLightEjercicio5);

    // geometrias
    const globeGeo = new THREE.SphereGeometry(1, 100, 100);
    const cloudsGeo = new THREE.SphereGeometry(1.01, 100, 100);
    const moonGeo = new THREE.SphereGeometry(0.27, 100, 100);

    // materiales
    const globeMat = new THREE.MeshPhongMaterial(
        { map: globeMap }
    );
    const cloudsMat = new THREE.MeshLambertMaterial(
        { color: 0xFFFFFF, map: cloudsMap, transparent: true }
    );
    const moonMat = new THREE.MeshLambertMaterial(
        { color: 0x888888, map: moonMap }
    );

    // mallas
    const globe = new THREE.Mesh(globeGeo, globeMat);
    const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
    const moon = new THREE.Mesh(moonGeo, moonMat);

    // jerarquia de objetos
    const earth = new THREE.Object3D();
    earth.add(globe);
    earth.add(clouds);

    const moonGroup = new THREE.Object3D();
    moonGroup.add(moon);

    // posicionamiento de objetos
    earth.rotation.set(0, 0, 0.36);
    const distance = 384400 / 6378;
    moon.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));
    moon.rotation.y = Math.PI; // Rotate the Moon to face visible side to the Earth (tidal locking)
    moonGroup.rotation.x = 0.089; // The Moon orbit is a bit tilted

    // aniadir objeto y renderizar
    scene.add(earth);
    scene.add(moonGroup);
    scene.add(light);
    renderer.render(scene, camera);

    // funciones
    function animate() {

        const delta = clock.getDelta(); // Elapsed time in seconds

        // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
        const globeRotation = (delta * Math.PI * 2) / 24;
        globe.rotation.y += globeRotation;
        clouds.rotation.y += globeRotation * 0.95;

        const moonRotation = (delta * Math.PI * 2) / (24 * 28);
        moon.rotation.y += moonRotation;

        // Render the scene
        renderer.render(scene, camera);

        // Request the browser to execute the animation-rendering loop
        requestAnimationFrame(animate);
    };

    // eventos
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);

    // inicio del loop de animacion
    requestAnimationFrame(animate);
}

