import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // vectors and sizes
    const cam_position = new THREE.Vector3(0, 0, 500);

    // escena
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const video = document.getElementById('video');
    const image = document.createElement('canvas');
    image.width = 480;  // Video width
    image.height = 204; // Video height
    const imageContext = image.getContext('2d');
    imageContext.fillStyle = '#000000';
    imageContext.fillRect(0, 0, image.width - 1, image.height - 1);
    const texture = new THREE.Texture(image);

    // camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);

    // geos
    const planeGeo = new THREE.PlaneGeometry(image.width, image.height, 4, 4);

    // mats
    const planeMat = new THREE.MeshBasicMaterial({ map: texture });

    // meshes
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);

    // transformations
    camera.position.set(cam_position.x, cam_position.y, cam_position.z);

    const test = new THREE.Mesh(
        new THREE.SphereGeometry(100, 100, 100),
        new THREE.MeshLambertMaterial()
    );
    test.position.set(0,0,0);
    /*scene.add(
        test
    );*/
    const testlight = new THREE.PointLight();
    testlight.position.set(100,100,500);
    testlight.decay = 0.2;
    scene.add(testlight);

    // scene add and render
    scene.add(planeMesh);
    renderer.render(scene, camera);

    // funciones
    function animate() {

        const delta = clock.getDelta(); // Elapsed time in seconds

        // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            imageContext.drawImage(video, 0, 0);
            if (texture) texture.needsUpdate = true;
        }
        const planeRotation = (delta * Math.PI * 2 / 24);
        planeMesh.rotation.y += planeRotation;

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

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame(animate);
}
