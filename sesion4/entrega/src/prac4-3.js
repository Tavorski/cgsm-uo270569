import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import Stats from 'three/examples/jsm/libs/stats.module';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    // urls
    const regular_face_url = "../textures/brickedwall";
    const regular_face_normal_url = "../textures/brickedwall_normal";

    const special_face_url = "../textures/special_face.png"; // Material for a face
    const special_face_normal_url = "../textures/special_face_normal.png"; // Material for a face

    const special_face_on_url = "../textures/special_face_on.png";

    const box_1_audio_url = "../audio/dog.ogg";
    const box_2_audio_url = "../audio/376737_Skullbeatz___Bad_Cat_Maste.ogg";

    // variables
    const box_1_size = 10;
    const box_2_size = 10;
    const cam_position = new THREE.Vector3(0, 10, 150);
    const box_1_position = new THREE.Vector3(70, box_1_size / 2, 0);
    const box_2_position = new THREE.Vector3(-70, box_2_size / 2, 0);
    const point_light_pos = new THREE.Vector3(0, 0, 30);
    const amb_light_pos = new THREE.Vector3();

    // escena
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    //grid
    const helper = new THREE.GridHelper(800, 40, 0x444444, 0x444444);
    helper.position.y = 0.1;

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
    camera.position.set(cam_position.x, cam_position.y, cam_position.z);

    // raycaster
    const rayCaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let intersectedObject = null;

    // audio
    const listener = new THREE.AudioListener();
    const box_1_audioLoader = new THREE.AudioLoader();
    const box_2_audioLoader = new THREE.AudioLoader();
    const box_1_sound = new THREE.PositionalAudio(listener);
    const box_2_sound = new THREE.PositionalAudio(listener);
    camera.add(listener);

    // controls
    const controls = new FirstPersonControls(camera, renderer.domElement);
    controls.movementSpeed = 50;
    controls.lookSpeed = 0.05;
    controls.noFly = false;
    controls.lookVertical = false;

    // lights
    const point_light = new THREE.PointLight();
    point_light.position.set(point_light_pos.x, point_light_pos.y, point_light_pos.z);
    point_light.intensity = 2;
    point_light.decay = 0;

    const amb_light = new THREE.AmbientLight();
    amb_light.position.set(cam_position.x, cam_position.y, cam_position.z);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf0f0f0, 0.6);
    hemiLight.position.set(0, 500, 0);
    hemiLight.intensity = 1.5;


    // mats
    const textureLoader = new THREE.TextureLoader();  // The object used to load textures
    const regular_face_mat = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load(regular_face_url),
            bumpMap: textureLoader.load(regular_face_normal_url)
        }
    );
    const special_face_mat = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load(special_face_url),
            bumpMap: textureLoader.load(special_face_normal_url)
        }
    );
    const special_face_mat_on = new THREE.MeshPhongMaterial(
        {
            map: textureLoader.load(special_face_on_url),
            bumpMap: textureLoader.load(special_face_normal_url)
        }
    );

    // box 1
    const box_1_geo = new THREE.BoxGeometry(box_1_size, box_1_size, box_1_size); // geo
    const box_1_mat_off = [ // A box has 6 faces
        special_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
    ];
    const box_1_mat_on = [ // A box has 6 faces
        special_face_mat_on,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
    ];
    const box_1_mesh = new THREE.Mesh(box_1_geo, box_1_mat_off); // mesh
    box_1_mesh.position.set(box_1_position.x, box_1_position.y, box_1_position.z);
    box_1_mesh.rotation.set(0, Math.PI, 0);
    box_1_audioLoader.load(box_1_audio_url, (buffer) => {
        box_1_sound.setBuffer(buffer);
        box_1_sound.setRefDistance(20);
        box_1_sound.setLoop(true);
        box_1_sound.setRolloffFactor(1);
        // box_1_sound.play(); // Modern browsers do not allow sound to start without user interaction
    });
    box_1_mesh.add(box_1_sound);
    box_1_mesh.name = "Caja 1";

    // box 2
    const box_2_geo = new THREE.BoxGeometry(box_2_size, box_2_size, box_2_size);
    const box_2_mat_off = [
        special_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
    ];
    const box_2_mat_on = [
        special_face_mat_on,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
        regular_face_mat,
    ];
    const box_2_mesh = new THREE.Mesh(box_2_geo, box_2_mat_off);
    box_2_mesh.position.set(box_2_position.x, box_2_position.y, box_2_position.z);
    box_2_audioLoader.load(box_2_audio_url, (buffer) => {
        box_2_sound.setBuffer(buffer);
        box_2_sound.setRefDistance(20);
        box_2_sound.setLoop(true);
        box_2_sound.setRolloffFactor(1);
        //box_2_sound.play(); // Modern browsers do not allow sound to start without user interaction
    });
    box_2_mesh.add(box_2_sound);
    box_2_mesh.name = "Caja 2";

    const controlData = {
        bumpScale: special_face_mat.bumpScale
    }

    // scene add and render
    scene.add(point_light);
    scene.add(box_1_mesh);
    scene.add(box_2_mesh);
    scene.add(helper);
    scene.add(hemiLight);
    renderer.render(scene, camera);

    // gui 
    // const gui = new GUI();
    // gui.add(controlData, 'bumpScale', -4, 4).step(0.1).name('bumpScale');

    // funciones
    function animate() {

        const delta = clock.getDelta(); // Elapsed time in seconds

        // UPDATE THE SCENE ACCORDING TO THE ELAPSED TIME
        //const boxRotation = (delta * Math.PI * 2 / 24);
        //box_1_mesh.rotation.y += boxRotation;

        // update values through gui
        box_1_mat_off.bumpScale = controlData.bumpScale;
        box_2_mat_off.bumpScale = controlData.bumpScale;

        // Render the scene
        renderer.render(scene, camera);

        // update stats
        stats.update();

        // raycasting
        rayCaster.setFromCamera(mouse, camera);

        /// Look for all the intersected objects
        const intersects = rayCaster.intersectObjects(scene.children);
        if (intersects.length > 0) {

            /// Sorted by Z (close to the camera)
            if (intersectedObject != intersects[0].object) {

                intersectedObject = intersects[0].object;
                console.log('New intersected object: ' + intersectedObject.name);
            }
        } else {

            intersectedObject = null;
        }

        // update controls
        controls.update(delta);

        // Request the browser to execute the animation-rendering loop
        requestAnimationFrame(animate);
    };

    // eventos
    document.body.addEventListener('keydown', (event) => {

        // Space key code
        const spaceKeyCode = 32;

        // Space pressed and intersected object
        if (event.keyCode === spaceKeyCode && intersectedObject) {

            // TODO:
            if (intersectedObject.name === "Caja 1")
                if (box_1_sound.isPlaying === true) {
                    box_1_sound.pause();
                    box_1_mesh.material = box_1_mat_off;
                    renderer.render(scene, camera);
                }
                else {
                    box_1_sound.play();
                    box_1_mesh.material = box_1_mat_on;
                    renderer.render(scene, camera);     
                }
            if (intersectedObject.name === "Caja 2")
                if (box_2_sound.isPlaying === true) {
                    box_2_sound.pause();
                    box_2_mesh.material = box_2_mat_off;
                    renderer.render(scene, camera);
                }
                else {
                    box_2_sound.play();
                    box_2_mesh.material = box_2_mat_on;
                    renderer.render(scene, camera);   
                }
        }
    }, false);
    document.body.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    }, false);
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);

    // Request the browser to execute the animation-rendering loop
    requestAnimationFrame(animate);
}
