import * as THREE from 'three';
import WEBGL from 'three/examples/jsm/capabilities/WebGL.js';

if (WEBGL.isWebGL2Available()) {
    // WebGL is available

    
    const cam_position = new THREE.Vector3(0, 0, 500);
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000);
    camera.position.set(cam_position.x, cam_position.y, cam_position.z);
    
    // escena
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // canvas
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    const constraints = {
        audio: false,
        video: { width: { exact: 640 }, height: { exact: 480 } }
    };
    
    const video = document.getElementById('player');
    const image = document.createElement('canvas');
    navigator.mediaDevices.getUserMedia(constraints)
        // Called when we get the requested streams
        .then((stream) => {

            // Video tracks (usually only one)
            const videoTracks = stream.getVideoTracks();
            console.log('Stream characteristics: ', constraints);
            console.log('Using device: ' + videoTracks[0].label);

            // End of stream handler
            stream.onended = () => {

                console.log('End of stream');
            };

            // Bind the stream to the html video element
            video.srcObject = stream;

            startButton.disabled = true;
            callButton.disabled = false;
            hangupButton.disabled = true;
        })
        // Called in case of error
        .catch((error) => {

            if (error.name === 'ConstraintNotSatisfiedError') {

                console.error('The resolution ' + constraints.video.width.exact + 'x' +
                    constraints.video.width.exact + ' px is not supported by the camera.');
            } else if (error.name === 'PermissionDeniedError') {

                console.error('The user has not allowed the access to the camera and the microphone.');
            }
            console.error(' Error in getUserMedia: ' + error.name, error);
        });
    image.width = 800;  // Video width
    image.height = 400; // Video height
    const imageContext = image.getContext('2d');
    imageContext.fillStyle = '#000000';
    imageContext.fillRect(0, 0, image.width - 1, image.height - 1);
    const texture = new THREE.Texture(image);

    const planeGeo = new THREE.PlaneGeometry(image.width, image.height, 4, 4);
    const planeMat = new THREE.MeshBasicMaterial({ map: texture });
    const planeMesh = new THREE.Mesh(planeGeo, planeMat);

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

