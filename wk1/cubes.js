var scene = new THREE.Scene(); 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer(); 

renderer.setSize(window.innerWidth, window.innerHeight); 

document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshNormalMaterial();
var cube = new THREE.Mesh( geometry, material );
scene.add( cube ); 

renderer.render(scene, camera);