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
    camera.position.set(0, 0, 300);

    // textures
    const mapUrl = "../textures/caja.gif";   // The file used as texture
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures
    const map = textureLoader.load(mapUrl, ( loaded ) => { renderer.render( scene, camera ); });

    // cubo
    const geometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial(
        {map: map}
    );
    const box = new THREE.Mesh(geometry, material);

    // rotacion cubo
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);

    // aniadir objeto y renderizar
    scene.add(box);
    renderer.render( scene, camera ); 

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}
