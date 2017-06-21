var scene, renderer, camera, controls;

var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    PIXEL_RATIO = window.devicePixelRatio || 1;

var bgColor = 0x111c2d;

props = new function() {
  this.neighborRadius = 13;
  this.separationRadius = 16;
  this.cohesion = 0.1;
  this.separation = 0.5;
  this.alignment = 0.1;
  this.avoidWalls = 1;
}

var gui = new dat.GUI();
gui.add(props, 'neighborRadius', 0, 50).onChange(updateScene);
gui.add(props, 'separationRadius', 0, 50).onChange(updateScene);
gui.add(props, 'cohesion', 0, 2).onChange(updateScene);
gui.add(props, 'separation', 0, 2).onChange(updateScene);
gui.add(props, 'alignment', 0, 2).onChange(updateScene);
gui.add(props, 'avoidWalls', 0, 2).onChange(updateScene);


var BOID_COUNT = 80;
var boid, boids = [], fish = [];

function initScene() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(15, WIDTH/HEIGHT, .1, 2000);
  camera.position.z = 350;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(bgColor);
  renderer.setPixelRatio(PIXEL_RATIO);
  renderer.setSize(WIDTH, HEIGHT);

  container = document.getElementById('scene');
  container.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.15;

  scene.add(camera);

  var directionalLightlight = new THREE.DirectionalLight( 0xFFFFFF, 1 );
  var ambientLight = new THREE.AmbientLight( 0x888888 ); // soft white light

  scene.add(directionalLightlight);
  scene.add(ambientLight);

  var cube = new THREE.Mesh(
    new THREE.BoxGeometry(100, 100, 100),
    new THREE.MeshBasicMaterial({ wireframe:true, color: 0x000000 }));

  scene.add(cube)

  var geometry = new THREE.ConeGeometry(0.5, 2, 6);
  geometry.rotateX(Math.PI/2);
  var material = new THREE.MeshPhongMaterial({ color: 0x2FA1D6 });

  for (var i = 0; i < BOID_COUNT; i++) {
    boid = boids[i] = new Boid();

    boid.position.x = Math.random() * 100 - 50;
    boid.position.y = Math.random() * 100 - 50;
    boid.position.z = Math.random() * 100 - 50;
    boid.velocity.x = Math.random() * 2 - 1;
    boid.velocity.y = Math.random() * 2 - 1;
    boid.velocity.z = Math.random() * 2 - 1;
    fish[i] = new THREE.Mesh(geometry, material);

    scene.add(fish[i]);
  }


  loop();
}

function loop() {
  controls.update();
  render();

  requestAnimationFrame(loop);
}

function render() {
  for (var i = 0; i < boids.length; i++) {
    boid = boids[i];
    boid.move(boids);
    fish[i].position.copy(boid.position);
    var aimP = new THREE.Vector3();
    aimP.copy(fish[i].position).add(boid.velocity);
    fish[i].lookAt(aimP);
  }
  renderer.render(scene, camera);
}

function updateScene() {
  controls.autoRotateSpeed = props.speed;
  Boid.update(props);
}

initScene();
updateScene();
