myArr = [];

myCubes = [];

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
            mainGuy.Reset();
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
            break;

            case GameFlowState.TALLY:
            document.getElementById("tally_ok_button").onclick = function(){
                document.getElementById("tally_ui").style.display = 'none';
                gameFlow.currentState = GameFlowState.INITIALISE;
            }
            document.getElementById("tally_ui").style.display = 'block';
            gameFlow.currentState = GameFlowState.UNKNOWN;
            console.log(mainGuy.shields);
            break;
        }

    }
}

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
        this.mesh.rotation.z += this.rate;
    }
    Reset(){
        super.Reset();
    }
}

class Box extends Entity{
    constructor(posY, posZ, rate){
        super();
        this.collidable = true;
        this.size = 0.5;  //THE HITBOX OF OTHER BOXES
        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshStandardMaterial({color: 0xFF6A00});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = getRandomFloat(-3, 6);
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.starting = posZ;

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false;

        this.rate = getRandomFloat(0.01, 0.1);

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

    }

    Update(){
        super.Update();
        if ( this.CollideWithObstacle() )
          {
              // console.log(" ------ CRASH ------- ");
          }

          this.mesh.rotation.y += this.rate;
          this.mesh.position.z += this.rate;

          if (this.mesh.position.z >= 7){ //when the subes start loopoing
            this.mesh.position.z = this.starting; //starting position
            this.mesh.position.x = getRandomFloat(-6, 6);
          }
          this.mesh.rotation.x -= this.rate; //ROTATES THE CUBES
          this.mesh.rotation.y -= this.rate;
          this.mesh.rotation.z -= this.rate;
        }
}

class Avatar extends Entity{
    constructor(posX, posY, rate){
        super();
        this.collidable = false;
        this.size = 0.5;  //THE HITBOX OF CHARACTER

        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshStandardMaterial({color: 0x1db4f9});
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = posX;
        this.mesh.position.y = posY;

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false;

        this.rate = rate;

        this.shields = 100;

        this.dead = false;

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
        this.mesh.position.x = -3;
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
            console.log(" ------ BANG ------- ");

            document.getElementById("hud_shields").style.visibility = "visible";

            console.log(this.shields);
          }

            else if(this.dead = true) {

              document.getElementById("hud_shields").style.visibility = "hidden";

              document.getElementById("dead").style.visibility = "visible";

              console.log(" ------ DEAD ------- ");

            }
            }

          this.Move()

          document.getElementById("hud_distance").innerHTML = (this.mesh.position.y/1000).toFixed(2) + " km";

          document.getElementById("hud_shields").innerHTML = "SHIELDS " + (this.shields).toFixed(2) + " %";

          // this.mesh.rotation.x += this.rate; //rotation stuff

    }

}

function getRandomFloat(min, max) { //random float between the MIN and MAX
  return Math.random() * (max - min)+min;
}

var mainGuy = new Avatar(-3, 0, 0.1);
myCubes.push(mainGuy);

for (let i=0; i<6; i++){
    myCubes.push(new Box(0, -5, 0.1));
}

var keyboard = new KeyboardService();

for (let i=0; i<5; i++){
    var myKnot = new Knot(i+1, 2, 0.01);
    myArr.push(myKnot);
}

var gameFlow = new GameFlow();


// ADDS FOG mate
// scene.fog = new THREE.FogExp2(0x19cfe8, 100, 100);

var animate = function (){
    requestAnimationFrame( animate );

    for (let i = 0; i<myCubes.length; i++){
        myCubes[i].Update();
    }

    for (let i = 0; i<myArr.length; i++){
        myArr[i].Update();
    }

    gameFlow.Update();

    renderer.render (scene, camera);

};

animate();
