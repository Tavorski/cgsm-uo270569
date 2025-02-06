import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // vectores
    const sunPos = new THREE.Vector3(0, 0, 15.00);
    const camPos = new THREE.Vector3(-30.00, 0, 2.00);

    // escena
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // camara
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(camPos.x, camPos.y, camPos.z);
    camera.rotation.set(0, -0.5 * Math.PI, 0)

    // textures
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures

    const globeMapUrl = "../textures/tierra";   // The file used as texture
    const cloudsMapUrl = "../textures/nubes.png";   // The file used as texture
    const moonMapUrl = "../textures/luna";   // The file used as texture
    const sunNoiseUrl = "../textures/ruido_sol.png";
    const sunUrl = "../textures/sol";
    const globeMap = textureLoader.load(globeMapUrl, (loaded) => { renderer.render(scene, camera); });
    const cloudsMap = textureLoader.load(cloudsMapUrl, (loaded) => { renderer.render(scene, camera); });
    const moonMap = textureLoader.load(moonMapUrl, (loaded) => { renderer.render(scene, camera); })

    const uniforms = {
        "fogDensity": { value: 0 },
        "fogColor": { value: new THREE.Vector3(0, 0, 0) },
        "time": { value: 1.0 },
        "uvScale": { value: new THREE.Vector2(3.0, 1.0) },
        "texture1": { value: textureLoader.load(sunNoiseUrl) },
        "texture2": { value: textureLoader.load(sunUrl) }
    };
    uniforms["texture1"].value.wrapS = uniforms["texture1"].value.wrapT = THREE.RepeatWrapping;
    uniforms["texture2"].value.wrapS = uniforms["texture2"].value.wrapT = THREE.RepeatWrapping;

    // fuentes de luz
    const light = new THREE.PointLight();
    light.intensity = 5;
    light.decay = 0;
    light.position.set(0, 0, 150);

    const sunLight = new THREE.PointLight();
    sunLight.intensity = 5;
    sunLight.decay = 0;
    sunLight.position.set(sunPos.x, sunPos.y, sunPos.z);

    // shader
    const vertexShader = require("../shaders/vertex.glsl");
    const fragmentShader = require("../shaders/fragment.glsl");

    // geometrias
    const globeGeo = new THREE.SphereGeometry(1.00, 100, 100);
    const cloudsGeo = new THREE.SphereGeometry(1.01, 100, 100);
    const moonGeo = new THREE.SphereGeometry(0.27, 100, 100);
    const sunGeo = new THREE.SphereGeometry(5, 100, 100)

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
    const sunMat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader
    });

    // mallas
    const globe = new THREE.Mesh(globeGeo, globeMat);
    const clouds = new THREE.Mesh(cloudsGeo, cloudsMat);
    const moon = new THREE.Mesh(moonGeo, moonMat);
    const sun = new THREE.Mesh(sunGeo, sunMat);

    // jerarquia de objetos
    const earth = new THREE.Object3D();
    earth.add(globe);
    earth.add(clouds);

    const moonGroup = new THREE.Object3D();
    moonGroup.add(moon);

    // posicionamiento de objetos
    earth.rotation.set(0, 0, 0.36);
    const distance = 384400 / 6378; // la distancia de tierra-luna expresa en radios terrestres
    moon.position.set(Math.sqrt(distance / 2), 0, -Math.sqrt(distance / 2));
    moon.rotation.y = Math.PI; // Rotate the Moon to face visible side to the Earth (tidal locking)
    moonGroup.rotation.x = 0.089; // The Moon orbit is a bit tilted
    sun.position.set(sunPos.x, sunPos.y, sunPos.z);

    // aniadir objeto y renderizar
    scene.add(earth);
    scene.add(moonGroup);
    scene.add(sunLight);
    scene.add(sun);
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

        // animacion textura sol
        uniforms["time"].value += 0.8 * delta;

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

