import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // urls
    const brickedwall = "../textures/brickedwall";
    const brickedwall_normal = "../textures/brickedwall_normal";

    // variables
    const cam_position = new THREE.Vector3(0, 0, 3);
    const point_light_pos = new THREE.Vector3(1, 0, 3);
    const amb_light_pos = new THREE.Vector3();
    const box_1_size = 1;

    // escena
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    document.body.appendChild(stats.domElement);

    // camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);

    // lights
    const point_light = new THREE.PointLight();
    point_light.intensity = 2;
    const amb_light = new THREE.AmbientLight();

    // geos
    const box_1_geo = new THREE.BoxGeometry(box_1_size, box_1_size, box_1_size);

    // mats
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures
    const box_1_mat = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load(brickedwall),
            bumpMap: textureLoader.load(brickedwall_normal)
        }
    );
    const controlData = {
        bumpScale: box_1_mat.bumpScale
    }

    // meshes
    const box_1_mesh = new THREE.Mesh(box_1_geo, box_1_mat);

    // transformations
    camera.position.set(cam_position.x, cam_position.y, cam_position.z);
    box_1_mesh.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    point_light.position.set(point_light_pos.x, point_light_pos.y, point_light_pos.z);
    amb_light.position.set(cam_position.x, cam_position.y, cam_position.z);

    // scene add and render
    scene.add(point_light);
    scene.add(box_1_mesh);
    renderer.render(scene, camera);

    // gui 
    const gui = new GUI();
    gui.add(controlData, 'bumpScale', -4, 4).step(0.1).name('bumpScale');

    // funciones
    function animate() {

        const delta = clock.getDelta(); // Elapsed time in seconds

        // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
        const boxRotation = (delta * Math.PI * 2 / 24);
        box_1_mesh.rotation.y += boxRotation;

        // update values through gui
        box_1_mat.bumpScale = controlData.bumpScale;

        // Render the scene
        renderer.render(scene, camera);

        // update stats
        stats.update( );
        
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

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame(animate);
}
