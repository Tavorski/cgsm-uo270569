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
    camera.position.set(0, 0, 2000);

    // formas
    const boxGeo = new THREE.BoxGeometry(100, 100, 100);
    const triangleGeo = new THREE.BoxGeometry
    const material = new THREE.MeshBasicMaterial();

    const box = new THREE.Mesh(boxGeo, material);
    const sphere = new THREE.Mesh(triangleGeo, material);
    const cylinder = new THREE.Mesh(cylinderGeo, material);

    // rotacion cubo
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    sphere.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    cylinder.rotation.set(Math.PI / 5, Math.PI / 5, 0);

    box.position.set(-300, 0, 0)
    cylinder.position.set(0, 0, 0)
    sphere.position.set(300, 0, 0)

    // aniadir objeto y renderizar
    scene.add(box);
    scene.add(sphere);
    scene.add(cylinder);
    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}
