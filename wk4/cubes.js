myArr = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 4;
camera.position.y = 1;
camera.rotation.x = -0.2;


//var helper = new THREE.CameraHelper(camera);
//scene.add(helper); 

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );



renderer.shadowMap.enabled = true; 
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //default 





//var lightAmb = new THREE.AmbientLight( 0xffffff, 0.3x );

var light1 = new THREE.DirectionalLight(0xffffff, 1);
light1.position.set(0, 10, 0);
light1.castShadow = true;

//var light2 = new THREE.DirectionalLight( 0x19cfe8, 3);
//light2.position.set(-50, 30, 0);
//light2.castShadow = false;




light1.shadow.mapSize.width = 512; //default values!!! 
light1.shadow.mapSize.height = 512;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;

scene.add(light1);


//var geometry = new THREE.BoxGeometry( 10, 10, 10 );
//var material = new THREE.MeshNormalMaterial();
//
//var geometry2 = new THREE.CylinderGeometry( 5, 5, 20, 32);
//
//var cube1 = new THREE.Mesh( geometry, material );
//var cube2 = new THREE.Mesh( geometry, material );
//
//var cyl = new THREE.Mesh( geometry2, material);
//var cyl2 = new THREE.Mesh( geometry2, material);

var planeGeometry = new THREE.PlaneGeometry (20, 20, 10, 10);
var planeMaterial = new THREE.MeshStandardMaterial({color: 0xfff000});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

//cube1.position.x =- 15;
//cyl.position.x =- 15;

//cube2.position.x = 15;
//cyl2.position.x = 15;

plane.position.x=0;
plane.position.y= -2;
plane.position.z=0;
plane.rotation.x = -1.570;

//scene.add( cube1, cube2, cyl, cyl2, plane );
scene.add( plane );

//document.addEventListener("keydown", onDocumentKeyDown, false);

//function onDocumentKeyDown(event) {
//  var keyCode = event.keyCode;
//      //up
//  if (keyCode == 38) {
//    cube1.position.y += 0.25;
//    cyl.position.y += 0.25;
//    cube2.position.y -= 0.25;
//    cyl2.position.y -= 0.25;
//      //down
//  } else if (keyCode == 40) {
//    cube1.position.y -= 0.25;
//    cyl.position.y -= 0.25;
//    cube2.position.y += 0.25;
//    cyl2.position.y += 0.25;
//      //left
//  } else if (keyCode == 37) {
//    cube1.position.x += 0.25;
//    cyl.position.x += 0.25;
//    cube2.position.x -= 0.25;
//    cyl2.position.x -= 0.25;
//      //right
//  } else if (keyCode == 39) {
//    cube1.position.x -= 0.25;
//    cyl.position.x -= 0.25;
//    cube2.position.x += 0.25;
//    cyl2.position.x += 0.25;
//      //space
//  } else if (keyCode == 32) {
//    cube1.position.x = -15;
//    cube1.position.y = 0.0;
//    cube1.position.z = 0.0;
//    cyl.position.x = -15;
//    cyl.position.y = 0.0;
//    cyl.position.z = 0.0;
//    cube2.position.x = 15;
//    cube2.position.y = 0.0;
//    cube2.position.z = 0.0;
//    cyl2.position.x = 15;
//    cyl2.position.y = 0.0;
//    cyl2.position.z = 0.0;
//  }
// };

// KEY CODES FOR WINDOWS = 38,40,37,39,32



class Tor{
  constructor(mat, posX, posY){
      this.geometryTor = new THREE.TorusGeometry(5, 1, 8, 100);
      this.materialTor = mat;
      this.mesh = new THREE.Mesh(this.geometryTor, this.materialTor);

      this.mesh.position.x = posX;
      this.mesh.position.y = posY;

      scene.add(this.mesh);
  }
  Spin(SPEEEEEN){
      this.mesh.rotation.y += SPEEEEEN;
  }
}

//var torBasic = new Tor(new THREE.MeshBasicMaterial({color: 0xffff00}), 0, 0);
//var torLam = new Tor(new THREE.MeshLambertMaterial({color: 0xffff00}), 0, 12);
//var torPho = new Tor(new THREE.MeshPhongMaterial({color: 0xffff00}), 0, 24);
//var torStan = new Tor(new THREE.MeshStandardMaterial({color: 0xffff00}), 0, 36);


class Knot{
    constructor(posX, posY){
        this.geometryKnot = new THREE.TorusKnotGeometry(0.5, 0.25, 100, 16);
        this.materialKnot = new THREE.MeshStandardMaterial({color: 0xffff00}); 
        this.mesh = new THREE.Mesh(this.geometryKnot, this.materialKnot); 
        
        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        
        this.mesh.castShadow = true; //default values 
        this.mesh.receiveShadow = false; 
        
        scene.add(this.mesh)
    }
    Spin(spinning){
        this.mesh.rotation.y += spinning; 
    }
} 

var knotOne = new Knot(0, 1);
var knotTwo = new Knot(-2, 1);
var knotThree = new Knot(2, 1); 
//var knotFour = new Knot(-6, 1);


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//ADDS FOG mate
//scene.fog = new THREE.FogExp2(0x19cfe8, 100, 1100); 



// class Entity{
//   constructor(geometry){
//     this.geometry = new THREE.BoxGeometry(2,10,2);
//     this.material = new THREE.MeshNormalMaterial();
//     this.mesh = new THREE.Mesh(this.geometry, this.material);
//
//     this.mesh.position.x = (getRandomInt(20)) || (getRandomInt(-20));
//     this.mesh.position.y = (getRandomInt(20)) || (getRandomInt(-20));
//     this.mesh.position.z = (getRandomInt(20)) || (getRandomInt(-20));
//
//     scene.add( this.mesh );
//   }
//   Update(){
//       (this.mesh.rotation.y += 0.02) || (this.mesh.rotation.y -= 0.02);
//   }
// }
//
// var myObject = new Entity();
//
// var obj2 = new Entity();
//
// for(let i=0; i<5; i++){
//         myArr.push(new Entity()); // fills array 6 collumns!!
//     }

var animate = function (){
    requestAnimationFrame( animate );
//    cube1.rotation.x += 0.01;
//    cube1.rotation.y += 0.01;
//    cube2.rotation.x -= 0.01;
//    cube2.rotation.y -= 0.01;
//    cyl.rotation.x += 0.01;
//    cyl.rotation.y += 0.01;
//    cyl2.rotation.x -= 0.01;
//    cyl2.rotation.y -= 0.01;

    // myObject.Update();
    // obj2.Update();
    //
    // for(let i=0; i<5; i++){  //allows the collumns to SHOW AND SPEEEEEN!
    //     myArr[i].Update();
    // }

//    torBasic.Spin(0.01);
//    torLam.Spin(0.012);
//    torPho.Spin(0.014);
//    torStan.Spin(0.016);
//    
    knotOne.Spin(0.01); 
    knotTwo.Spin(0.012);
    knotThree.Spin(0.014);
//    knotFour.Spin(0.016);

    renderer.render (scene, camera);

};

animate();
