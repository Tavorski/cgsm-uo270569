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
    camera.position.set(-450, 0, 2000);

    // materiales
    const material = new THREE.MeshBasicMaterial();
    const matBox = new THREE.MeshBasicMaterial();;
    matBox.color.setColorName("red");
    const matCylinder = new THREE.MeshLambertMaterial();
    matCylinder.color.setColorName("blue");
    const matSphere = new THREE.MeshPhongMaterial();
    matSphere.color.setColorName("green");

    // fuentes de luz
    const light = new THREE.DirectionalLight();
    light.intensity = 2;
    light.position.set(-450, -200, 700);

    // formas
    const boxGeo = new THREE.BoxGeometry(100, 100, 100);
    const sphereGeo = new THREE.SphereGeometry(100);
    const cylinderGeo = new THREE.CylinderGeometry(100, 100, 100);
    
    const box = new THREE.Mesh(boxGeo, matBox);
    const sphere = new THREE.Mesh(sphereGeo, matSphere);
    const cylinder = new THREE.Mesh(cylinderGeo, matCylinder);

    // rotacion cubo
    box.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    sphere.rotation.set(Math.PI / 5, Math.PI / 5, 0);
    cylinder.rotation.set(Math.PI / 5, Math.PI / 5, 0);

    box.position.set(-900, 0, 0)
    cylinder.position.set(-600, 0, 0)
    sphere.position.set(-300, 0, 0)



    // aniadir objeto y renderizar
    scene.add(box);
    scene.add(sphere);
    scene.add(cylinder);
    scene.add(light);

    // casa
    const geometry = new THREE.BufferGeometry();

    const inner = 100;
    const outer = 130;
    const anchoPuerta = inner / 5;
    const vertices = new Float32Array([
        // Internal vertices
        -inner, inner, 0,
        inner, inner, 0,
        inner, -inner, 0,
        -inner, -inner, 0,

        // External vertices
        -outer, outer, 0,
        outer, outer, 0,
        outer, -outer, 0,
        -outer, -outer, 0,

        // tejado
        0, outer * 2, 0, //8 

        // puerta
        anchoPuerta, 0, 0, //9
        -anchoPuerta, 0, 0, //10
        anchoPuerta, -inner, 0, //11
        -anchoPuerta, -inner, 0, //12

    ]);

    // Faces (indices of vertices)
    const indices = [
        5, 4, 0,
        0, 1, 5,
        6, 5, 1,
        1, 2, 6,
        7, 6, 2,
        2, 3, 7,
        4, 7, 3,
        3, 0, 4,
        // tejado
        4, 5, 8,
        // puerta
        10, 12, 9,
        12, 11, 9

    ];

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const cuadradoAgujero = new THREE.Mesh(geometry, material);
    scene.add(cuadradoAgujero);

    renderer.render(scene, camera);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }, false);
}
