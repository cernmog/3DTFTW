myCubes = [];

floorDetailArr = [];

sideDetailArr = [];

var score = 0;

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.y = 1.5;
camera.rotation.x = -0.2;

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //default

var light1 = new THREE.DirectionalLight(0x9700FF, 1);
light1.position.set(10, 10, -2);
light1.castShadow = true;

var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1);
light2.position.set(-10, 10, -2);
light2.castShadow = true;


//CHANGES THE AREA SHADOWS ARE CAST
light1.shadow.camera.top = 20;
light1.shadow.camera.bottom = -20;
light1.shadow.camera.left = -20;
light1.shadow.camera.right = 20;

light1.shadow.mapSize.width = 512; //default values!!!
light1.shadow.mapSize.height = 512;
light1.shadow.camera.near = 0.5;
light1.shadow.camera.far = 500;

light2.shadow.camera.top = 20;
light2.shadow.camera.bottom = -20;
light2.shadow.camera.left = -20;
light1.shadow.camera.right = 20;

light2.shadow.mapSize.width = 512; //default values!!!
light2.shadow.mapSize.height = 512; //
light2.shadow.camera.near = 0.5;
light2.shadow.camera.far = 500;

scene.add(light1, light2);

//FOG SHIT
fogColor = new THREE.Color(0xffffff);

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.0025, 25);

//////////////////SNOW STUFF!!
// create the particle variables
// var particleCount = 1800,
//     particles = new THREE.Geometry(),
//     pMaterial = new THREE.PointsMaterial({
//       color: 0xFFFFFF,
//       size: 20
//     });

// now create the individual particles
// for (var p = 0; p < particleCount; p++) {
//
//   // create a particle with random
//   // position values, -250 -> 250
//   var pX = Math.random() * 5 - 2,
//       pY = Math.random() * 5 - 2,
//       pZ = Math.random() * 5 - 2,
//       particle = new THREE.Vector3(
//         new THREE.Vector3(pX, pY, pZ)
//       );
//
//   // add it to the geometry
//   particles.vertices.push(particle);
// }
//
// // create the particle system
// var particleSystem = new THREE.Points(
//     particles,
//     pMaterial);
//
// // add it to the scene
// scene.add(particleSystem);

//////////////////SNOW STUFF!!

GameFlowState = {

    UNKNOWN : 0,
    INITIALISE : 1,
    GAMESTART : 2,
    GAMEPLAY : 3,
    TALLY : 4
};

class Entity {
  constructor(){
  }

  Update(){

  }

  Reset(){

  }
}

class GameFlow{
    constructor(){

        this.currentState = GameFlowState.INITIALISE;

    }
    Update(){

        switch ( this.currentState ){

            case GameFlowState.INITIALISE:
            document.getElementById("intro_ok_button").onclick = function(){ //adds a callback to wait for the player to click on a specific button
                document.getElementById("intro_ui").style.display = 'none';
                gameFlow.currentState = GameFlowState.GAMESTART;
            }
            document.getElementById("intro_ui").style.display = 'block'; //makes the intro user interface visible
            gameFlow.currentState = GameFlowState.UNKNOWN; // updates the gameflow state to UNKNOWN, which has no code associated with it

            for (let i = 0; i<myCubes.length; i++){ //puts Avatar and Snowballs back to Starting positions!
                myCubes[i].Reset();
            }
            for (let i = 0; i<floorDetailArr.length; i++){ //puts Avatar and Snowballs back to Starting positions!
                floorDetailArr[i].Reset();
            }
            for (let i = 0; i<sideDetailArr.length; i++){ //puts Avatar and Snowballs back to Starting positions!
                sideDetailArr[i].Reset();
            }
            score = 0;
            // sun.Reset();
            // sun2.Reset();
            // sun3.Reset(); SORT OUT RE-SETTING SUNS!!!
            break;

            case GameFlowState.UNKNOWN:
            break;

            case GameFlowState.GAMESTART:
            mainGuy.shields = 100;
            gameFlow.currentState = GameFlowState.GAMEPLAY;
            break;

            case GameFlowState.GAMEPLAY:

            if (mainGuy.shields <=  0 ){
                gameFlow.currentState = GameFlowState.TALLY;
            }
            mainGuy.Move();   //Avatar and snowballs only move when it's gameplay!
            for (let i = 0; i<myCubes.length; i++){
                myCubes[i].Update();
            }
            for (let i = 0; i<floorDetailArr.length; i++){
                floorDetailArr[i].Update();
            }
            for (let i = 0; i<sideDetailArr.length; i++){
                sideDetailArr[i].Update();
            }

            score++;

            break;

            case GameFlowState.TALLY:
            document.getElementById("tally_ok_button").onclick = function(){
                document.getElementById("tally_ui").style.display = 'none';
                gameFlow.currentState = GameFlowState.INITIALISE;
            }
            document.getElementById("tally_ui").style.display = 'block';
            gameFlow.currentState = GameFlowState.UNKNOWN;
            break;
        }

    }
}

var planeGeometry = new THREE.PlaneGeometry (200, 200, 10, 10);
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


class Knot extends Entity{
    constructor(posX, posY, posZ, rate){
        super(); //THIS HAS TO BE CALLED BEFORE CONTRUCTOR STUFF
        this.geometryKnot = new THREE.TorusKnotGeometry(0.5, 0.25, 100, 16);
        this.materialKnot = new THREE.MeshStandardMaterial({color: 0x2AD7FD});
        this.mesh = new THREE.Mesh(this.geometryKnot, this.materialKnot);

        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.mesh.receiveShadow = false;

        this.rate = rate;

        scene.add(this.mesh);
    }

    Update(){
        super.Update();
        this.mesh.rotation.z -= this.rate;
        this.mesh.position.x -= this.rate; //moves across the sky!
        this.mesh.position.z -= this.rate;
    }
    Reset(){
        super.Reset();
        //SORT OUT THE RESET FOR SUNS!
        // this.mesh.position.x = posX;
        // this.mesh.position.y = posY;
        // this.mesh.position.z = posZ;
    }
}

class Box extends Entity{
    constructor(posY, posZ){
        super();
        this.collidable = true;

        this.randSize = getRandomFloat(0.1, 1.8)

        this.size = this.randSize/2;  //THE HITBOX OF OTHER BOXES
        this.geometry = new THREE.BoxGeometry(this.randSize,this.randSize,this.randSize);
        this.material = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = getRandomFloat(-8, 8);
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.starting = posZ;

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false;

        this.rate = getRandomFloat(0.01, 10);

        scene.add(this.mesh);
    }


    DistanceTo(x, z) {
        // (xA-xB)²+(yA-yB)²+(zA-zB)² < (rA+rB)²
        let dist = Math.abs ( Math.sqrt (
          ( ( this.mesh.position.x - x ) * ( this.mesh.position.x - x ) ) +
          ( ( this.mesh.position.z - z ) * ( this.mesh.position.z - z ) )) );

        // console.log("DistanceTo() = " + dist);
        return dist;
    }

    IsCollideWith(that){
      // size + size > distance
      let collidedWith = (this.size + that.size) > this.DistanceTo(this.mesh.position.x, that.mesh.position.z);
      // console.log("IsCollidedWith() " + collidedWith + " " + (this.size + that.size));
      return collidedWith;
    }

    CollideWithObstacle(){
      for (var n=0; n<myCubes.length; n++ ){
        if (myCubes[n].collidable == true){
          if (this.IsCollideWith(myCubes[n]) == true){
            return true;
          }
        }
      }
      return false;
    }
    Reset(){
        super.Reset();
        this.mesh.position.z = this.starting;
        this.rate = getRandomFloat(0.01, 0.1);
        console.log("YO!");
    }

    Update(){
        super.Update();
        if ( this.CollideWithObstacle() )
          {
              // console.log(" ------ CRASH ------- ");
          }

          this.mesh.position.z += this.rate;

          // FIX THiS!!!!!!!!
          // let yPos = this.mesh.position.y;
          //
          // if (this.mesh.position.y <= 3){
          //   this.mesh.position.y ++;
          // }
          // if (this.mesh.position.y = -1){
          //   this.mesh.position.y --
          // }
            // FIX THiS!!!!!!!!


          if (this.mesh.position.z >= 10){ //when the subes start loopoing
            this.mesh.position.z = this.starting; //starting position
            this.mesh.position.x = getRandomFloat(-8, 8);
            this.rate = getRandomFloat(0.01, 0.1);
          }
          this.mesh.rotation.x -= this.rate ; //ROTATES THE CUBES
          this.mesh.rotation.y -= this.rate;
        }

}

class Avatar extends Entity{
    constructor(posX, posY, posZ, rate){
        super();
        this.collidable = false;
        this.size = 0.6;  //THE HITBOX OF CHARACTER

        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshStandardMaterial({color: 0x1db4f9});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false;

        this.rate = rate;

        this.shields = 100;

        this.dead = false;

        this.moving = false;

        scene.add(this.mesh);
    }

    Move(){
      var controlSpeed  = 0.08;
      //upArrow
      if (keyboard.IsKeydown(38) == true) {
          this.mesh.position.y += controlSpeed;
      } //downArrow
      if (keyboard.IsKeydown(40) == true) {
          this.mesh.position.y -= controlSpeed;
      } // A - move left
      if (keyboard.IsKeydown(65) == true) {
          this.mesh.position.x -= controlSpeed;
          this.mesh.rotation.z += this.rate; //ROLL LEFT
      } // D - move right
      if (keyboard.IsKeydown(68) == true) {
          this.mesh.position.x += controlSpeed;
          this.mesh.rotation.z -= this.rate; //ROLL RIGHT
        }
        // W Key - move futher away
      if (keyboard.IsKeydown(87) == true){
        this.mesh.position.z -= controlSpeed;
        this.mesh.rotation.x -= this.rate; //ROLL FORWARD
      } // S Key - move closer
      if (keyboard.IsKeydown(83) == true){
        this.mesh.position.z += controlSpeed;
        this.mesh.rotation.x += this.rate; //ROLL BACK
      }
    }

    DistanceTo(x, z) {
        // (xA-xB)²+(yA-yB)²+(zA-zB)² < (rA+rB)²
        let dist = Math.abs ( Math.sqrt (
          ( ( this.mesh.position.x - x ) * ( this.mesh.position.x - x ) ) +
          ( ( this.mesh.position.z - z ) * ( this.mesh.position.z - z ) )) );

      //  console.log("DistanceTo() = " + dist);
        return dist;
    }

    IsCollideWith(that){
      // size + size > distance
      let collidedWith = (this.size + that.size) > this.DistanceTo(that.mesh.position.x, that.mesh.position.z);
    //   console.log("IsCollidedWith() " + collidedWith + " " + (this.size + that.size));
      return collidedWith;
    }

    CollideWithObstacle(){
      for (var n=0; n<myCubes.length; n++ ){
        if (myCubes[n].collidable == true){
          if (this.IsCollideWith(myCubes[n]) == true){
            return true;
          }
        }
      }
      return false;
    }

    Reset(){
        super.Reset();
        this.mesh.position.x = 0;
        this.mesh.position.y = 0;
        this.mesh.position.z = 0;

        mainGuy.shields = 100;
        document.getElementById("dead").style.visibility = "hidden";
        document.getElementById("hud_shields").style.visibility = "visible";
    }
    Update(){
        super.Update();

        if ( this.CollideWithObstacle() )
          {
            if (this.shields > 0){
            this.shields--;  //decrementing the DOM element sheilds
            // console.log(" ------ BANG ------- ");

            document.getElementById("hud_shields").style.visibility = "visible";

            // console.log(this.shields);
          }

            else if(this.dead = true) {

              document.getElementById("hud_shields").style.visibility = "hidden";

              document.getElementById("dead").style.visibility = "visible";

              // console.log(" ------ DEAD ------- ");

            }
            }

          this.distance = 0;

          // document.getElementById("hud_distance").innerHTML = (this.distance++).toFixed(2) + " km";

          document.getElementById("hud_shields").innerHTML = "SHIELDS " + (this.shields).toFixed(2) + " %";

          // this.mesh.rotation.x += this.rate; //rotation stuff

    }

}

class floorDetail extends Entity {
  constructor(posZ, rate){
    super();
    this.randR = getRandomFloat(0.1, 0.25);
    this.randH = getRandomFloat(0.1, 1);
    this.geometry = new THREE.ConeGeometry(this.randR, this.randH, 3); //radius, height, segments
    this.material = new THREE.MeshStandardMaterial({color: 0xD08CFF});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = getRandomFloat(-12, 12);;
    this.mesh.position.y = -2;
    this.mesh.position.z = getRandomFloat(-15, -100);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.starting = posZ;

    this.rate = rate;

    scene.add(this.mesh);

  }

  Update(){
    super.Update();
    if (this.mesh.position.z >= 10){ //when the subes start loopoing
      this.mesh.position.z = this.starting; //starting position
      this.mesh.position.x = getRandomFloat(-20, 20);
    }

    this.mesh.position.z += this.rate; //MOVING TOWARDS PLAYER

  }

  Reset(){
    super.Reset();

    this.mesh.position.z = this.starting;
    console.log("YO!");

  }
}

class sideDetail extends Entity {
  constructor(posX, posZ, rate){
    super();
    this.randW = getRandomFloat(0.05, 5);
    this.randH = getRandomFloat(0.01, 50);
    this.randD = getRandomFloat(0.05, 5);
    this.geometry = new THREE.BoxGeometry(this.randW, this.randH, this.randD); //width, height, depth
    this.material = new THREE.MeshStandardMaterial({color: 0xD08CFF});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = posX;
    this.mesh.position.y = -3;
    this.mesh.position.z = getRandomFloat(-30, -100);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.startingZ = posZ;
    this.startingX = posX;

    this.rate = rate;

    scene.add(this.mesh);

  }

  Update(){
    super.Update();
    if (this.mesh.position.z >= 10){ //when the subes start loopoing
      this.mesh.position.z = this.startingZ; //starting position
      this.mesh.position.x = this.startingX;
    }

    this.mesh.position.z += this.rate; //MOVING TOWARDS PLAYER

  }

  Reset(){
    super.Reset();

    this.mesh.position.z = this.startingZ;
    console.log("SIDE RESPAWN");

  }
}

function getRandomFloat(min, max) { //random float between the MIN and MAX
  return Math.random() * (max - min)+min;
}

var mainGuy = new Avatar(0, 0, 5, 0.05);
  myCubes.push(mainGuy);

for (let i=0; i<30; i++){
    var snowball = new Box(0, -20);
    myCubes.push(snowball);
}

for (let i=0; i<20; i++){
  let randomStart = getRandomFloat(-15, -100)
  var spikes = new floorDetail(randomStart, 0.6)
  floorDetailArr.push(spikes);
}

for (let i=0; i<20; i++){
  let randomStart = getRandomFloat(-50, -100)
  let startLeft = getRandomFloat(-8, -25)
  let startRight = getRandomFloat(8, 25)
  var sideLeft = new sideDetail(startLeft, randomStart, 0.6)
  var sideRight = new sideDetail(startRight, randomStart, 0.6)
  sideDetailArr.push(sideLeft, sideRight);
}

var keyboard = new KeyboardService();

var sun = new Knot(5, 3, -2, 0.002);
var sun2 = new Knot(0, 6, -5, 0.001);
var sun3 = new Knot(5, 4, -10, 0.0005);


var gameFlow = new GameFlow();


// ADDS FOG mate
// scene.fog = new THREE.FogExp2(0x19cfe8, 100, 100);

var animate = function (){
    requestAnimationFrame( animate );

    document.getElementById("hud_distance").innerHTML = score.toFixed(2) + " km";

    sun.Update();
    sun2.Update();
    sun3.Update();

    gameFlow.Update();

    renderer.render (scene, camera);

};

animate();
