// what you'll be viewing
var scene = new THREE.Scene();
// camera: what user will see the world through
// near clipping plane, far clipping plane
var camera = new THREE.PerspectiveCamera(75, window.innerWidth /
  window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// update viewpoint (resizing window)
window.addEventListener('resize', function() {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
var controls;
controls = new THREE.OrbitControls(camera, renderer.domElement);
// controls.addEventListener( 'change', render );

//_____________________________________________________________________________
// variables

var fftSize = 1024;

// // create shape
// var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
// var edges = new THREE.EdgesGeometry(geometry);
// var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( {
//   color: 0xffffff
// }));

//_____________________________________________________________________________

// create an AudioListener

var cubes = new Array();
var numCubes = 10;
for(var i = 0; i < numCubes; i++) {
  // create a cube
  var cubeGeo = new THREE.BoxBufferGeometry(0.5, 0.5, 0.5);
  var edges = new THREE.EdgesGeometry(cubeGeo);
  var material = new THREE.LineBasicMaterial( {
    color: 0xffffff,
    linewidth:2
  });
  // var material = new THREE.MeshBasicMaterial( {
  //   wireframe: true,
  //   color: 0xffffff
  // });

  // put cubes in array called cubes
  cubes[i] = new THREE.LineSegments(edges, material);
  cubes[i].position.set(i - numCubes/2, 0, 0);
  scene.add(cubes[i]);
}

var listener = new THREE.AudioListener();
// create a global audio source
var audio = new THREE.Audio(listener);
var mediaElement = new Audio('music/end.ogg');

// gets audio frequency
var analyser = new THREE.AudioAnalyser(audio, fftSize);

//
// analyser.data: A Uint8Array with size determined by
// analyser.frequencyBinCount used to hold analysis data.

// play button
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);
startButton.addEventListener('click', animation);

//_____________________________________________________________________________

function init() {

  // removes overlay after play is pressed
  var overlay = document.getElementById('overlay');
  overlay.remove();

  mediaElement.loop = true;
  mediaElement.play();
  audio.setMediaElementSource(mediaElement);

  // // add in the cube
  // scene.add(line);

  // change camera so its not on top of the cube
  camera.position.y = 20;
}

function animation() {
  var freqArray = analyser.getFrequencyData();

  var step = Math.round(freqArray.length / numCubes);

  //Iterate through the bars and scale the z axis
  for (var i = 0; i < numCubes; i++) {
    var value = freqArray[i * step] / 4;
    value = value < 1 ? 1 : value;
    cubes[i].scale.y = value;
  }
}

// var data = analyser.getAverageFrequency();
// var bpm = data * 60;

//_____________________________________________________________________________

// update: called every frame of whatever you're checking
// (movement, events, etc)
var update = function() {
  // line.rotation.x += Math.abs(Math.cos(bpm)/25);
  // line.rotation.y += Math.abs(Math.cos(bpm)/70);
  var speed = Date.now() * 0.0004;
  camera.position.x = Math.cos(speed) * 15;
  camera.position.z = Math.sin(speed) * 15;
  camera.position.y = 10;
  camera.lookAt(scene.position);
};

// draws scene
var render = function() {
  // update data in frequencyData
  analyser.getFrequencyData();
  renderer.render(scene, camera);
};

// specifies how the game will be flowing
// checks updates, processes it, renders it
function animationLoop() {
  requestAnimationFrame(animationLoop);
  update();
  render();
  animation();
  //console.log(analyser.getFrequencyData());
  //console.log(bpm);
}
animationLoop();
