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
    const mapUrl = "../textures/tierra";   // The file used as texture
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures
    const map = textureLoader.load(mapUrl, (loaded) => { renderer.render(scene, camera); });

    // fuentes de luz
    const light = new THREE.PointLight();
    light.intensity = 5;
    light.decay = 0;
    light.position.set(0, 0, 150);

    // geometria
    const geometry = new THREE.SphereGeometry(100, 100, 100);
    const material = new THREE.MeshPhongMaterial(
        { map: map }
    );
    const earth = new THREE.Mesh(geometry, material);

    // rotacion cubo
    earth.rotation.set(Math.PI / 5, Math.PI / 5, 0);

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