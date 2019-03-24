// what you'll be viewing
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x324344);

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

var fftSize = 2048;

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

// play button
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);
// startButton.addEventListener('click', animation);

var listener;
// create a global audio source
var audio;

// gets audio frequency
var analyser;

//_____________________________________________________________________________

function init() {
  // removes overlay after play is pressed
  var overlay = document.getElementById('overlay');
  overlay.remove();

  listener = new THREE.AudioListener();
// create a global audio source
  audio = new THREE.Audio(listener);

// gets audio frequency
  analyser = new THREE.AudioAnalyser(audio, fftSize);
  var mediaElement = new Audio();

  var dir, ext, list;
  dir = 'music/';
  ext = '.ogg';
  list = document.getElementById("list");
  // whenever user changes anything on list, it changes track
  list.addEventListener("change", changeTrack);
  function changeTrack(event) {
    mediaElement.pause();
    mediaElement = new Audio(event.target.value+ext);
    audio.setMediaElementSource(mediaElement);
    //audio.source = dir+event.target.value+ext;
    mediaElement.play();
  }
  animationLoop();
}

// function init() {
//   listener = new THREE.AudioListener();
// // create a global audio source
//   audio = new THREE.Audio(listener);
//
// // gets audio frequency
//   analyser = new THREE.AudioAnalyser(audio, fftSize);
//   var mediaElement = new Audio('music/trojans.ogg');
//
//   // removes overlay after play is pressed
//   var overlay = document.getElementById('overlay');
//   overlay.remove();
//
//   mediaElement.play();
//   mediaElement.loop = true;
//   audio.setMediaElementSource(mediaElement);
//
//   // // add in the cube
//   // scene.add(line);
//
//   // change camera so its not on top of the cube
//   camera.position.y = 20;
//   animationLoop();
// }

function animation() {
  var freqArray = analyser.getFrequencyData();

  var step = Math.round(freqArray.length / numCubes);

  // render the cubes at different heights
  for (var i = 0; i < numCubes; i++) {
    // take frequency data and use it to determine the height of each cube
    if(i == 7) {
      value = freqArray[4 * step] / 16;
    }
    else if(i == 8) {
      value = freqArray[3 * step] / 16;
    }
    else if(i == 9) {
      value = freqArray[2 * step] / 16;
    }
    else {
      var value = freqArray[i * step] / 16;
    }
    value = value < 1 ? 1 : value;
    cubes[i].scale.y = value;
  }
}

//_____________________________________________________________________________

// update: called every frame of whatever you're checking
// (movement, events, etc)
var update = function() {
  var speed = Date.now() * 0.0004;
  camera.position.x = Math.cos(speed) * 13;
  camera.position.z = Math.sin(speed) * 13;
  camera.position.y = 5;
  camera.lookAt(scene.position);
};

var render = function() {
  // update data in frequencyData
  //analyser.getFrequencyData();
  renderer.render(scene, camera);
};

// specifies how the program will be flowing
// checks updates, processes it, renders it
function animationLoop() {
  requestAnimationFrame(animationLoop);
  update();
  render();
  animation();
  //console.log(analyser.getFrequencyData());
  //console.log(bpm);
}
