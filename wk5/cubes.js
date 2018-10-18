myArr = [];

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.y = 1;
camera.rotation.x = -0.2;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //default

var light1 = new THREE.DirectionalLight(0x9700FF, 1);
light1.position.set(10, 10, 0);
light1.castShadow = true;

var light2 = new THREE.DirectionalLight( 0xFFFFFF, 2);
light2.position.set(-10, 10, 0);
light2.castShadow = true;


//CHANGES THE AREA SHADOWS ARE CAST
light1.shadow.camera.top = 10;
light1.shadow.camera.bottom = -10;
light1.shadow.camera.left = -10;
light1.shadow.camera.right = 10;

light1.shadow.mapSize.width = 512; //default values!!!
light1.shadow.mapSize.height = 512; //
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;

scene.add(light1, light2);

var planeGeometry = new THREE.PlaneGeometry (20, 20, 10, 10);
var planeMaterial = new THREE.MeshStandardMaterial({color: 0xD08CFF});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.position.x=0;
plane.position.y= -2;
plane.position.z=0;
plane.rotation.x = -1.570;

scene.add( plane );



class Service{
    constructor(){

    }
    Update(){

    }
}; 


function onDocumentKeyDown(event) {
    var keyCode = event.keyCode;
    keyboard.keys[keyCode]=true; 
}; 

function onDocumentKeyUp(event) {
    var keyCode = event.keyCode;
    keyboard.keys[keyCode]=false; 
}; 

class KeyboardService extends Service{
    constructor(){
        super(); 
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener("keyup", onDocumentKeyUp, false);
        
        this.keys=[]; 

    }
    Update(){
        
    }

    IsKeydown(keyCode){
        return this.keys[keyCode]; 
    }
}; 


class Entity {
  constructor(){
  }

  Update(){

  }

  Reset(){

  }
}

class Knot extends Entity{ 
    constructor(posX, posY, rate){
        super(); //THIS HAS TO BE CALLED BEFORE CONTRUCTOR STUFF 
        this.geometryKnot = new THREE.TorusKnotGeometry(0.5, 0.25, 100, 16);
        this.materialKnot = new THREE.MeshStandardMaterial({color: 0x2AD7FD});
        this.mesh = new THREE.Mesh(this.geometryKnot, this.materialKnot);

        this.mesh.position.x = posX;
        this.mesh.position.y = posY;

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false;

        this.rate = rate;

        scene.add(this.mesh); 
    }

    Update(){
        super.Update(); 
        this.mesh.rotation.y += this.rate;
    }
    Reset(){
        super.Reset(); 
    }
}  

class Avatar extends Entity{
    constructor(posX, posY, rate){
        super(); 
        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshStandardMaterial({color: 0xFF6A00});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = posX; 
        this.mesh.position.y = posY; 

        this.rate = rate; 
        
        scene.add(this.mesh);
    }
    Update(){
        super.Update();
        this.mesh.rotation.y += this.rate; 
        //upArrow 
        if (keyboard.IsKeydown(38) == true) {
            this.mesh.position.y += 0.025; 
        } //downArrow 
        if (keyboard.IsKeydown(40) == true) {
            this.mesh.position.y -= 0.025; 
        } //leftArrow
        if (keyboard.IsKeydown(37) == true) {
            this.mesh.position.x -= 0.025; 
        } //rightArrow
        if (keyboard.IsKeydown(39) == true) {
            this.mesh.position.x += 0.025; 
        } //Spacebar 
        if (keyboard.IsKeydown(32) == true) {
            this.mesh.position.x = 0;
            this.mesh.position.y = 0;
            this.mesh.position.z = 0; 
        }
        
    }
    Reset(){
        super.Reset(); 
    }
    Move(){
    }
}

var chara = new Avatar(0, 0, 0.01);

var keyboard = new KeyboardService(); 

for (let i=0; i<5; i++){
    var myKnot = new Knot(i, 1, 0.01);
    myArr.push(myKnot); 
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// ADDS FOG mate
// scene.fog = new THREE.FogExp2(0x19cfe8, 100, 100);

var animate = function (){
    requestAnimationFrame( animate );

    for (let i = 0; i<myArr.length; i++){

        myArr[i].Update();   
    }

    chara.Update(); 

    renderer.render (scene, camera);

};

animate();