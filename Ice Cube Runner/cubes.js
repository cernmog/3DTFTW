myCubes = [];  //array for avatar and oncoming cubed 

floorDetailArr = [];  //array for small floor cones

sideDetailArr = [];  //array for left and right details

mySunArr = [];  //array for the three "suns" in air 

heathKitArr = [];  //array for green medkits 

speedUpArr = [];  //array for red speed-up kits 

var score = 0;  //global score of zero for tally counter

var scene = new THREE.Scene();   //creates a new scene 
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);  //sets captured dimentions
camera.position.z = 6;   //positions of camera
camera.position.y = 1.5;
camera.rotation.x = -0.2;

var renderer = new THREE.WebGLRenderer();     // setting the renderer so that everything is visable in scene 
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var mainListener = new THREE.AudioListener();
// create a global audio for main music
var mainSound = new THREE.Audio( mainListener );

var healthListener = new THREE.AudioListener();
// create a global audio for getting health kit
var healthSound = new THREE.Audio( healthListener );

var speedListener = new THREE.AudioListener();
// create a global audio for getting speed kit
var speedSound = new THREE.Audio( speedListener );

var breakListener = new THREE.AudioListener();
// create a global audio for dying/breaking
var breakSound = new THREE.Audio( breakListener );

camera.add( mainListener, healthListener, speedListener, breakListener); 

// load a sound and set it as the Audio object's buffer
var loadMain = new THREE.AudioLoader();
loadMain.load( 'Komiku_-_02_-_Home.mp3', function( buffer ) {
	mainSound.setBuffer( buffer );
	mainSound.setLoop( true );  // main audio will loop when stopped
	mainSound.setVolume( 0.2 ); // main volume 
	mainSound.play();
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //default

var light1 = new THREE.DirectionalLight(0xffffff, 1); //creates white directional light
light1.position.set(10, 10, -2);
light1.castShadow = true;

var light2 = new THREE.DirectionalLight( 0xFFFFFF, 1); //creates white directional light
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

var ambLight = new THREE.AmbientLight( 0x404040 ); // soft white light

scene.add(light1, light2, ambLight); //add these lights to the scene

//FOG
fogColor = new THREE.Color(0xffffff); //set to white fog
scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 0.00025, 25);  // area of what the fog will effect on objects 

GameFlowState = { // defines the different states of the game

    UNKNOWN : 0,
    INITIALISE : 1,  //set-up
    GAMESTART : 2,  //starting the game (intro UI)
    GAMEPLAY : 3,  //Actual gameplay
    TALLY : 4,    //Player has died
    PAUSED : 5    //player has paused 
};

class Entity {   //creates an empty Entity for new objects to extend 
  constructor(){
  }

  Update(){

  }

  Reset(){

  }
}

class GameFlow{
    constructor(){

        this.currentState = GameFlowState.INITIALISE;   //Very start of sequence

    }
    Update(){

        switch ( this.currentState ){

            case GameFlowState.INITIALISE:    
            mainGuy.shields = 100; //SETS THE SHEILDS BACK TO 100!
            document.getElementById("intro_ok_button").onclick = function(){ //adds a callback to wait for the player to click on a specific button
                document.getElementById("intro_ui").style.display = 'none';  //hides the intro UI

                document.getElementById("controls_ui").style.display = 'block'; //displays the controls UI
                  document.getElementById("controls_ok_button").onclick = function(){ // if ok button is pressed... 
                      gameFlow.currentState = GameFlowState.GAMESTART;  //start the game
                        document.getElementById("controls_ui").style.display = 'none';  //hide the controls UI
                  }

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
            for (let i = 0; i<mySunArr.length; i++){ //puts "suns" back to Starting positions!
                mySunArr[i].Reset();
            }
            for (let i = 0; i<heathKitArr.length; i++){ //puts healthkits back to Starting positions!
              heathKitArr[i].Reset(); 
            }
            for (let i = 0; i<speedUpArr.length; i++){ //puts speed kits back to Starting positions!
              speedUpArr[i].Reset();
            }

            score = 0; //resetting the score to zero every new game

            break;

            case GameFlowState.UNKNOWN:
            break;

            case GameFlowState.GAMESTART:
            gameFlow.currentState = GameFlowState.GAMEPLAY;
            break;

            case GameFlowState.GAMEPLAY:

            mainSound.setVolume( 0.4 );  //increase slightly going into game

            if (mainGuy.shields <=  0 ){  //check when the sheilds are dead...

              var loadBreak = new THREE.AudioLoader();  //play the audio sound effect 
              loadBreak.load( 'break_effect.wav', function( buffer ) {
              	breakSound.setBuffer( buffer );
              	breakSound.setVolume( 0.5 );
              	breakSound.play();
              });

                gameFlow.currentState = GameFlowState.TALLY; //switch to tally/game over
            }

            if (keyboard.IsKeydown(32) == true) { //WHEN SPACE IS PRESSED
              setTimeout(pause, 100);  // needs to include delay otherwise input bounces
              function pause(){
                gameFlow.currentState = GameFlowState.PAUSED;  //switch to pause
              }
            }

            mainGuy.Move();  //allows avatar to move 

            // LINES 197 - 219: allow movement only when it's gameplay!
            for (let i = 0; i<myCubes.length; i++){
                myCubes[i].Update();
            }
            
            for (let i = 0; i<floorDetailArr.length; i++){
                floorDetailArr[i].Update();
            }

            for (let i = 0; i<sideDetailArr.length; i++){
                sideDetailArr[i].Update();
            }

            for (let i = 0; i<mySunArr.length; i++){
                mySunArr[i].Update();
            }

            for (let i = 0; i<heathKitArr.length; i++){
                heathKitArr[i].Update();
            }

            for (let i = 0; i<speedUpArr.length; i++){
              speedUpArr[i].Update();
          }

            score++; //increment the score

            if ( mainGuy.CollideWithHealth() ){    // WHEN TOUCHED THE MEDKIT IT RESETS!!

              var loadHealthUp = new THREE.AudioLoader();  //load the audio cue 
              loadHealthUp.load( 'health_up_effect.wav', function( buffer ) {
              	healthSound.setBuffer( buffer );
              	healthSound.setVolume( 0.2 );
              	healthSound.play();
              });

              mainGuy.shields = mainGuy.shields+10;  //increases the sheilds by then

              document.getElementById("hud_shields").style.color = "#00FF00"; // 234 - 250 changes HUD notification from black to green!

              setTimeout(turnBlack, 1000);

              function turnBlack(){
                document.getElementById("hud_shields").style.color = "#000000";
              }

              fadeInHealth();
              setTimeout(fadeOutHealth, 1000);

              function fadeInHealth (){
                document.getElementById("health_Get").style.opacity = 1;
              }
              function fadeOutHealth (){
                document.getElementById("health_Get").style.opacity = 0;
              }

              for (let i = 0; i<heathKitArr.length; i++){  //on touch the midkit goes back to the start
                  heathKitArr[i].Reset();
              }
            }

            if ( mainGuy.CollideWithSpeedUp() ){  //WHEN TOUCHING THE SPEED UP POWERUP!!!

              var loadSpeedUp = new THREE.AudioLoader();  //plays the audio sound effect
              loadSpeedUp.load( 'speed_up_effect.wav', function( buffer ) {
              	speedSound.setBuffer( buffer );
              	speedSound.setVolume( 0.2 );
              	speedSound.play();
              });

                  for (let i = 0; i<speedUpArr.length; i++){ //all kits move back to start (too hard if they all don't!)
                    speedUpArr[i].Reset();
                }

              doSpeedUp();  // this speeds up all of the moving objects 

              fadeInSpeed();   //line 272 -280 flash black and red notifying speed-up! 
              setTimeout(fadeOutSpeed, 1000);

              function fadeInSpeed (){
                document.getElementById("speed_Up").style.opacity = 1;
              }

              function fadeOutSpeed (){
                document.getElementById("speed_Up").style.opacity = 0;
              }

              }

            break;

            case GameFlowState.TALLY:

            document.getElementById("tally_ui").style.display = 'block';  //show gameover screen

            document.getElementById("tally_ok_button").onclick = function(){
                document.getElementById("tally_ui").style.display = 'none';
                document.getElementById("tally_ui").style.color = "#FFFFFF"; //TURN BACK TO WHITE AFTER CLICK
                gameFlow.currentState = GameFlowState.INITIALISE;
            }

            setTimeout(turnRed, 1000);  // TURNS GAME OVER RED AFTER A SECOND
            function turnRed(){
              document.getElementById("tally_ui").style.color = "#bc1414";
            }

            var tallyScore  = document.getElementById('tally_score');
            document.getElementById("tally_text").style.color = "#FFFFFF"

            tallyScore.innerHTML = " "+score;  //displays the counter that has been incremented from the DOM


            gameFlow.currentState = GameFlowState.UNKNOWN;
            break;

            case GameFlowState.PAUSED:

            mainSound.setVolume( 0.1 );  //muffle the volume slightly

            document.getElementById("paused_ui").style.display = 'block';  //shows the PAUSED hud

            if (keyboard.IsKeydown(32) == true) { //WHEN SPACE IS PRESSED
                setTimeout(unPause, 100);       //ADDING SMALL DELAY
                function unPause(){
                document.getElementById("paused_ui").style.display = 'none';
                gameFlow.currentState = GameFlowState.GAMEPLAY;  //goes back into game
              }
            }

            break;
        }

    }
}

var planeGeometry = new THREE.PlaneGeometry (200, 200, 10, 10);  //creates the floor 
var planeMaterial = new THREE.MeshStandardMaterial({color: 0xD08CFF}); //gives it a shiney colour
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true; 

plane.position.x=0;  //sets its' position 
plane.position.y= -2;
plane.position.z=0;
plane.rotation.x = -1.570; //rotates so it's not flush with camera

scene.add( plane );

function doSpeedUp(){  // this function called all the speed up methods from the objects it effects and increases their movement 

  for (let i = 1; i<myCubes.length; i++){
    myCubes[i].SpeedUp();
}

for (let i = 0; i<floorDetailArr.length; i++){
  floorDetailArr[i].SpeedUp();
}

for (let i = 0; i<sideDetailArr.length; i++){
  sideDetailArr[i].SpeedUp();
}

};

class Service{
    constructor(){

    }
    Update(){

    }
};

function onDocumentKeyDown(event) {  //listens to when the player is pushing and releasing a key
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

        this.keys=[];  // array to store ASCII values 

    }
    Update(){


    }

    IsKeydown(keyCode){
        return this.keys[keyCode];
    }
};


class Knot extends Entity{  //class to create the "suns"
    constructor(posX, posY, posZ, rate){
        super(); //THIS HAS TO BE CALLED BEFORE CONTRUCTOR STUFF

        this.geometryKnot = new THREE.IcosahedronBufferGeometry(1, 0);

        this.materialKnot = new THREE.MeshStandardMaterial({color: 0x2AD7FD});
        this.mesh = new THREE.Mesh(this.geometryKnot, this.materialKnot);

        this.mesh.position.x = this.startingX;
        this.mesh.position.y = this.startingY;
        this.mesh.position.z = this.startingZ;

        this.startingX = posX;  //Where they will appear in the sky
        this.startingY = posY;
        this.startingZ = posZ;

        this.mesh.receiveShadow = false; // no need to receive shadows

        this.rate = rate; //this is their movement speed 

        scene.add(this.mesh);
    }

    Update(){
        super.Update();
        this.mesh.rotation.z -= this.rate;
        this.mesh.position.x -= this.rate/2; //moves across the sky!
        this.mesh.position.z -= this.rate*2;
    }
    Reset(){
        super.Reset();  //resets them after each game to the begining 
        this.mesh.position.x = this.startingX;
        this.mesh.position.y = this.startingY;
        this.mesh.position.z = this.startingZ;
    }
}

class Box extends Entity{  //creates the other cubes flying at you! 
    constructor(posY, posZ, col, opa, trans){
        super();

        this.collidable = true;  //checks that they can collide with avatar 

        this.randSize = getRandomFloat(0.3, 1.8) //size of their geometry 

        this.size = this.randSize/2;  //THE HITBOX OF OTHER BOXES
        this.geometry = new THREE.BoxGeometry(this.randSize,this.randSize,this.randSize);
        this.material = new THREE.MeshStandardMaterial({color: col, opacity: opa, transparent: trans  }); //Giving it an alpha channel 
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = getRandomFloat(-8, 8); //starts anywhere across the horizon line 
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.starting = posZ;  //for resets and initalising the game 

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false; //appear too black if true

        this.rate = (getRandomFloat(0.01, 10)) + this.speed; 

        this.speed = 0;  //Adds on to their rate 

        scene.add(this.mesh);
    }

    Reset(){
        super.Reset();
        this.mesh.position.z = this.starting;
        this.rate = (getRandomFloat(0.01, 0.1)); //randoms their speed every reset

        this.speed = 0  //RESETS THE SPEED UP!!!

    }

    Update(){
        super.Update();
          this.mesh.position.z += this.rate; //moves towards the avatar 

          if (this.mesh.position.z >= 10){ //when the subes start loopoing
            this.mesh.position.z = this.starting; //starting position
            this.mesh.position.x = getRandomFloat(-8, 8);
            this.rate = getRandomFloat(0.01, 0.1) + this.speed;
          }
          this.mesh.rotation.x -= this.rate; //ROTATES THE CUBES
          this.mesh.rotation.y -= this.rate;
        }

    SpeedUp(){
      this.speed = this.speed + 0.02; //increases their Z position by an set amount 
    }

}

class HealthKit extends Box{ //extending off the boxes healthkits are the oppsite
  constructor(posY, posZ){
    super(posY, posZ, 0x00FF00); //Turns them green!
    this.collidable = true;  //allows for collision with the avatar 

    this.size = 1; //size of hitbox

    scene.add(this.mesh);

  }

  Reset(){
    super.Reset();

    this.rate = 0.01;

    this.mesh.position.x = getRandomFloat(-8, 8); 
  }

  Update(){
    super.Update();

    this.mesh.position.z += 0.1;

    if (this.mesh.position.z >= 10){ //when the Cubes start loopoing
      this.mesh.position.z = getRandomFloat(-50, -150); //starting position (OR HOW FREQUENT THEY SPAWN!)
      this.mesh.position.x = getRandomFloat(-8, 8);
    }
  }

}

class SpeedUpKit extends Box{  //creates the speed up kits!
  constructor(posY, posZ){
    super(posY, posZ, 0xaf0a0a);
    this.collidable = true;

    this.size = 1;

    scene.add(this.mesh);

  }

  Reset(){
    super.Reset();

    this.rate = 0.01;

    this.mesh.position.x = getRandomFloat(-8, 8);
    this.mesh.position.z = getRandomFloat(-50, -150);
  }

  Update(){
    super.Update();

    this.mesh.position.z += 0.1;

    if (this.mesh.position.z >= 10){ //when the Cubes start loopoing
      this.mesh.position.z = getRandomFloat(-50, -150); //starting position (OR HOW FREQUENT THEY SPAWN!)
      this.mesh.position.x = getRandomFloat(-8, 8);
    }
  }

}

class Avatar extends Entity{  //creates the playable character 
    constructor(posX, posY, posZ, rate){
        super();
        this.collidable = false;
        this.size = 0.6;  //THE HITBOX OF CHARACTER

        this.geometry = new THREE.BoxGeometry(1,1,1);
        this.material = new THREE.MeshStandardMaterial({color: 0x0077ff, opacity: 0.9, transparent: true });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.x = posX;
        this.mesh.position.y = posY;
        this.mesh.position.z = posZ;

        this.mesh.castShadow = true; //default values
        this.mesh.receiveShadow = false;

        this.rate = rate;

        this.shields = 100; // shields when created 

        scene.add(this.mesh);
    }

    Move(){  //method that connects to the lsitener, adds fluid input for movement
      var controlSpeed  = 0.08;
      // A - move left
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

    DistanceTo(x, z) { //calculates the distance to a set position (mainly used for testing)
        // (xA-xB)²+(yA-yB)²+(zA-zB)² < (rA+rB)²
        let dist = Math.abs ( Math.sqrt (
          ( ( this.mesh.position.x - x ) * ( this.mesh.position.x - x ) ) +
          ( ( this.mesh.position.z - z ) * ( this.mesh.position.z - z ) )) );

        return dist;
    }

    IsCollideWith(that){ // "that" is the other object hitting the avatars hitbox
      // size + size > distance
      let collidedWith = (this.size + that.size) > this.DistanceTo(that.mesh.position.x, that.mesh.position.z);
      return collidedWith;
    }

    CollideWithObstacle(){ //checks if the objects/obstacles have touched yet
      for (var n=0; n<myCubes.length; n++ ){
        if (myCubes[n].collidable == true){
          if (this.IsCollideWith(myCubes[n]) == true){
            return true;
          }
        }
      }
  }

    CollideWithHealth(){  
      for (var i=0; i<heathKitArr.length; i++ ){
        if (heathKitArr[i].collidable == true){
          if (this.IsCollideWith(heathKitArr[i]) == true){

            return true;
          }
        }
      }
      return false;
    }

    CollideWithSpeedUp(){  // checks for colliding with speed up kits 
      for (var i=0; i<speedUpArr.length; i++ ){
        if (speedUpArr[i].collidable == true){
          if (this.IsCollideWith(speedUpArr[i]) == true){

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

        mainGuy.shields = 100; //resets the sheilds to full every new game 
        document.getElementById("hud_shields").style.visibility = "visible";
    }
    Update(){
        super.Update();

        if ( this.CollideWithObstacle() ) //When touching other hitbox
          {
            if (this.shields > 0){
            this.shields--;  //decrementing the DOM element sheilds

            document.getElementById("hud_shields").style.visibility = "visible";

          }
        }

          this.distance = 0;

          document.getElementById("hud_shields").innerHTML = "SHIELDS " + this.shields + " %"; //sets the HUD element 

    }

}

class floorDetail extends Entity { //created the small cones on the floor
  constructor(posZ){
    super();
    this.randR = getRandomFloat(0.1, 0.25);
    this.randH = getRandomFloat(0.1, 1);
    this.geometry = new THREE.ConeGeometry(this.randR, this.randH, 3); //radius, height, segments
    this.material = new THREE.MeshStandardMaterial({color: 0xD08CFF, opacity: 0.8, transparent: true });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = getRandomFloat(-12, 12);
    this.mesh.position.y = -2;
    this.mesh.position.z = getRandomFloat(-15, -100);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.starting = posZ;

    this.rate = 0.6;

    this.speed = 0;

    scene.add(this.mesh);

  }

  Update(){
    super.Update();
    if (this.mesh.position.z >= 10){ //when the subes start loopoing
      this.mesh.position.z = this.starting; //starting position
      this.mesh.position.x = getRandomFloat(-20, 20);
      this.rate = (0.6 + this.speed)
    }

    this.mesh.position.z += this.rate; //MOVING TOWARDS PLAYER

  }

  Reset(){
    super.Reset();

    this.mesh.position.z = this.starting;

    this.speed = 0  //RESETS THE SPEED UP!!!

  }

  SpeedUp(){
    this.speed = this.speed + 0.02;
  }
}

class sideDetail extends Entity {  //created the side detail on left and right 
  constructor(posX, posZ, rate){
    super();
    this.randW = getRandomFloat(0.05, 5);  // gives them random sizes for the geometry 
    this.randH = getRandomFloat(0.01, 50);
    this.randD = getRandomFloat(0.05, 5);
    this.geometry = new THREE.BoxGeometry(this.randW, this.randH, this.randD); //width, height, depth
    this.material = new THREE.MeshStandardMaterial({color: 0xD08CFF, opacity: (getRandomFloat(0.4, 1)), transparent: true});
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.x = posX;
    this.mesh.position.y = -3;
    this.mesh.position.z = getRandomFloat(-30, -100);

    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;

    this.startingZ = posZ;
    this.startingX = posX;

    this.rate = 0.6;

    this.speed = 0;

    scene.add(this.mesh);

  }

  Update(){
    super.Update();
    if (this.mesh.position.z >= 10){ //when the subes start loopoing
      this.mesh.position.z = this.startingZ; //starting position
      this.mesh.position.x = this.startingX;
      this.rate = (0.6 + this.speed)
    }

    this.mesh.position.z += this.rate; //MOVING TOWARDS PLAYER

  }

  Reset(){
    super.Reset();

    this.mesh.position.z = this.startingZ;

    this.speed = 0;  //RESETS THE SPEED UP!!!
  }
  SpeedUp(){
    this.speed = this.speed + 0.02;
  }
}

function getRandomFloat(min, max) { //random float between the MIN and MAX
  return Math.random() * (max - min)+min;
}

var mainGuy = new Avatar(0, 0, 5, 0.05); //CHARATER
  myCubes.push(mainGuy); //moves avatar into the array

for (let i=0; i<20; i++){ //SNOWBALLS
    var snowball = new Box(0, -20, 0xa8fdff, getRandomFloat(0.6, 0.9), true );
    myCubes.push(snowball);
}

for (let i=0; i<20; i++){ //FLOOR DETAIL
  let randomStart = getRandomFloat(-15, -100)
  var spikes = new floorDetail(randomStart)
  floorDetailArr.push(spikes); //moves the detail objects into array 
}

var medKit = new HealthKit (0, -50);
heathKitArr.push(medKit); //stores the medkit into own array

for (let i=0; i<6; i++){
  var SpeedUpKits = new SpeedUpKit(0, -50);
  speedUpArr.push(SpeedUpKits);  //stores the speed up kits into own array
}

for (let i=0; i<20; i++){ //LEFT AND RIGHT SIDE DETAIL
  let randomStart = getRandomFloat(-50, -100)
  let startLeft = getRandomFloat(-8, -25)
  let startRight = getRandomFloat(8, 25)
  var sideLeft = new sideDetail(startLeft, randomStart)
  var sideRight = new sideDetail(startRight, randomStart)
  sideDetailArr.push(sideLeft, sideRight);
}

var keyboard = new KeyboardService();

var sun = new Knot(-2, 3, -2, 0.002);
var sun2 = new Knot(0, 6, -5, 0.001); //setting the positions of the suns
var sun3 = new Knot(5, 4, -10, 0.0005);

mySunArr.push(sun, sun2, sun3); //SUNS!!

//THIS CODE HAS BEEN TAKEN AND ADAPTED FROM: https://medium.com/@joshmarinacci/snowflake-particles-when-points-just-arent-enough-4593023bbff6
//LINES: 833 - 855 & 868 - 877

flakes = new THREE.Group()
const geom = new THREE.PlaneBufferGeometry(0.1, 0.1)
const mat = new THREE.MeshLambertMaterial({
    color:'white', opacity: 0.6,
    transparent:true, side:THREE.DoubleSide})

for(let i=0; i<150; i++) {
   var flake = new THREE.Mesh(geom,mat)
   flake.position.set(getRandomFloat(-10,10),getRandomFloat(-5,7),getRandomFloat(-20,10))
   flake.velocity = new THREE.Vector3(0,getRandomFloat(-5,-30),0)
   const rot = getRandomFloat(0,3)
   if(rot === 0) flake.rotationVelocity
       = new THREE.Vector3(getRandomFloat(-30,30),0,0)
   if(rot === 1) flake.rotationVelocity
       = new THREE.Vector3(0,getRandomFloat(-30,30),0)
   if(rot === 2) flake.rotationVelocity
       = new THREE.Vector3(0,0,getRandomFloat(-30,30))

   flakes.add(flake)
}

flakes.position.z = -2
scene.add(flakes)



var gameFlow = new GameFlow();

var animate = function (){  //everything inside here will loop every tick of PC!
    requestAnimationFrame( animate );

    gameFlow.Update(); //keeps the game states looping every tick 

    document.getElementById("hud_distance").innerHTML = score.toFixed(2) + " km";

    if(flakes) {
     flakes.children.forEach(flake => {
         flake.position.x += flake.velocity.x/1000
         flake.position.y += flake.velocity.y/1000
         flake.position.z += flake.velocity.z/1000
         flake.rotation.x += getRandomFloat(0.01,0.1)
         if(flake.position.y < -10) flake.position.y += 20
     })

   }

    renderer.render (scene, camera);
};

animate();
