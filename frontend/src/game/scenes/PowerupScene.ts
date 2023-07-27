import { Scene } from 'phaser';
let SPEEDP = 300;
let SPEEDE = 300;
let power = 1;

//TODO: make the hitter paddel longer
//TODO: make the enemy paddel shorter
//TODO: make the ball velocity to the maximum (900)
//TODO: generate other n balls

//* -------------------------------------------------------------------------- */

//* when the ballpower gets out of bound => 2 sec
//* a ballpower effect
//? when the ball hit the ballpower => random powerup

export default class PowerupScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemy!: Phaser.Physics.Arcade.Sprite;
  private ball!: Phaser.Physics.Arcade.Sprite;
  private ballpower!: Phaser.Physics.Arcade.Sprite;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key };
  private score1!: number;
  private score2!: number;
  private scoreText1!: Phaser.GameObjects.Text;
  private scoreText2!: Phaser.GameObjects.Text;
  private ballSound!: Phaser.Sound.BaseSound;
  private cheer1!: Phaser.Sound.BaseSound;
  private cheer2!: Phaser.Sound.BaseSound;
  private cheer3!: Phaser.Sound.BaseSound;
  private cheer4!: Phaser.Sound.BaseSound;
  private boo1!: Phaser.Sound.BaseSound;
  private boo2!: Phaser.Sound.BaseSound;
  private soundtrack!: Phaser.Sound.BaseSound;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private emitterpowerup!: Phaser.GameObjects.Particles.ParticleEmitter;
  private shape1!: Phaser.Geom.Circle;
  private powerup!: boolean;
 
  constructor () {
    super({ key: 'PowerupScene' })
	this.shape1 = new Phaser.Geom.Circle(0, 0, 0);
	// this.shape1 = new Phaser.Geom.Circle(this.scale.width / 2, this.scale.height / 2, 160);
  }

  init () {
    this.score1 = 0;
    this.score2 = 0;
	this.powerup = false;
  }
  
  create () {
    // Background
	const background = this.add.image(0, 0, 'sky');
	background.setOrigin(0, 0);  // Set the origin to the top-left corner
	background.displayWidth = this.scale.width;
	background.displayHeight = this.scale.height;

	this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
		background.displayWidth = gameSize.width;
		background.displayHeight = gameSize.height;
	});
    // Game key input
    // Arrows
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.cursor = this.input.keyboard!.createCursorKeys();

    // WASD
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    };

    // Load player
    this.player = this.physics.add.sprite(30, this.scale.height / 2, 'wall');
    this.player.setOrigin(0.5, 0.5);
    this.player.setScale(0.55, 0.25);
    this.player.setCollideWorldBounds(true);
    this.player.setImmovable(true);

    // Load enemy
    this.enemy = this.physics.add.sprite(this.scale.width - 30, this.scale.height / 2, 'wall');
    this.enemy.setOrigin(0.5, 0.5);
    this.enemy.setScale(0.55, 0.25);
    this.enemy.setCollideWorldBounds(true);
    this.enemy.setImmovable(true);

    // Load ball
    this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ball');
    this.ball.setVelocity(-200, 0);
    this.ball.setData('onPaddlePlayer', false);
    this.ball.setData('onPaddleEnemy', false);
	
	this.ball.setData('onpowerplayer', false);
    this.ball.setData('onpowerenemy', false);
    
	this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);

	// Load ballpower
  power = Phaser.Math.Between(1, 3);

  this.ballpower = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'big');
  switch (power) {
    case 1:
      break;
      case 2:
        this.ballpower.setTexture('small');
        break;
        case 3:
          this.ballpower.setTexture('speed');
    break;
  }
	this.ballpower.setScale(2, 2);
	this.ballpower.setVelocity(0, 50);
	// this.ballpower.setBounce(0);

    // Score text
    this.scoreText1 = this.add.text(16, 16, '0', { fontSize: '32px'})
    this.scoreText2 = this.add.text(this.scale.width -50, 16, '0', { fontSize: '32px'})
    // audio
    this.ballSound = this.sound.add('pong');
    this.cheer1 = this.sound.add('cheer1');
    this.cheer1.addMarker({
      name: "duration",
      start: 0,
      duration: 4,
    });
    this.cheer2 = this.sound.add('cheer2');
    this.cheer3 = this.sound.add('cheer3');
    this.cheer4 = this.sound.add('cheer4');
    this.boo1 = this.sound.add('boo1');
    this.boo2 = this.sound.add('boo2'); 
    this.soundtrack = this.sound.add('soundtrack', {
      loop: true, // Imposta loop su true per far ripartire in loop
      volume: 0.5, // Adjust the volume as needed (0.0 to 1.0)
    });
    /*this.soundtrack.play();*/
    // emitter
    this.emitter = this.add.particles(this.ball.x, this.ball.y, 'flares', {
      frame: { frames: [ 'red', 'green', 'blue', 'white', 'yellow' ], cycle: true },
      blendMode: 'ADD',
      angle: { min: 0, max: 360},
      scale: { start: 0.5, end: 0 },
      lifespan: 300, // Durata di vita delle particelle (in millisecondi)
      frequency: 100, // Frequenza di emissione delle particelle (in millisecondi)
      // follow: this.ball // Seguire l'oggetto della palla
  });

  this.emitterpowerup = this.add.particles(this.ballpower.x, this.ballpower.y, 'flares', {
	frame: { frames: [ 'red' ] },
	blendMode: 'ADD',
	angle: { min: 0, max: 360},
	scale: { start: 0.5, end: 0 },
	lifespan: 300, // Durata di vita delle particelle (in millisecondi)
	frequency: 100, // Frequenza di emissione delle particelle (in millisecondi)
	// follow: this.ballpower // Seguire l'oggetto della palla
});
  
  }
  
  update () {
	// console.log(this.ball.body!.velocity.x);
	if (this.ball.body!.velocity.x > 900 || this.ball.body!.velocity.x < -900) {
		// console.log("am i here bitch");
		if (this.ball.body!.velocity.x > 0)
			this.ball.body!.velocity.x = 900;
		else
			this.ball.body!.velocity.x = -900;
		// this.ball.setVelocityX(-1000);
	}
    this.movePlayer();
    this.moveEnemy();
    this.ballCollision();
    this.endGame();
	this.powerupreposition();
    this.emitter.setPosition(this.ball.x, this.ball.y);
    this.emitter.addEmitZone({ type: 'edge', source: this.shape1, quantity: 64, total: 1 });
	this.emitterpowerup.setPosition(this.ballpower.x, this.ballpower.y);
    this.emitterpowerup.addEmitZone({ type: 'edge', source: this.shape1, quantity: 64, total: 1 });
    if (this.ball.getData('onPaddlePlayer')) {
      this.ball.setVelocityY((Math.random() * 50) + this.player.body!.velocity.y);
      this.ball.setVelocityX(this.ball.body!.velocity.x + (0.1) * this.ball.body!.velocity.x);
      this.ball.setData('onPaddlePlayer', false);
    } else if (this.ball.getData('onPaddleEnemy')) {
      this.ball.setVelocityY((Math.random() * 50) + this.enemy.body!.velocity.y);
      this.ball.setVelocityX(this.ball.body!.velocity.x + (0.1) * this.ball.body!.velocity.x);
      this.ball.setData('onPaddleEnemy', false);
    }

    if (this.ball.x >= this.scale.width || this.ball.x <= 0) {
      if (this.ball.x >= this.scale.width) {
        this.score1++;
        this.scoreText1.setText(this.score1.toString());
      } else {
        this.score2++;
        this.scoreText2.setText(this.score2.toString());
      }
      this.ballLost();
    }

  }

  movePlayer() {
    if (this.wasd.up.isDown)
      this.player.setVelocityY(-SPEEDP);
    else if (this.wasd.down.isDown)
      this.player.setVelocityY(SPEEDP);
    else
      this.player.setVelocityY(0);
  }

  moveEnemy() {
    if (this.cursor.up.isDown)
      this.enemy.setVelocityY(-SPEEDE);
    else if (this.cursor.down.isDown)
      this.enemy.setVelocityY(SPEEDE);
    else
      this.enemy.setVelocityY(0);
  }

  ballCollision() {
    this.ball.setData('onPaddlePlayer', false);
    this.ball.setData('onPaddleEnemy', false);
  this.physics.world.collide(this.player, this.ball, () => { this.ball.setData('onPaddlePlayer', true); /*this.ballSound.play();*/ this.ball.setData('onpowerenemy', false); this.ball.setData('onpowerplayer', true)});
    this.physics.world.collide(this.enemy, this.ball, () => { this.ball.setData('onPaddleEnemy', true); /*this.ballSound.play();*/ this.ball.setData('onpowerplayer', false); this.ball.setData('onpowerenemy', true)});

	this.physics.world.overlap(this.ball, this.ballpower, () => {
		console.log("am inside man");
		if (this.ball.getData('onpowerenemy'))
		{
			console.log("the enemy hit me bitch");
			this.powerup = true;
			this.ballpower.setPosition(-100, this.scale.height + 100);
			this.powerUpEnemy();
		}
		else if (this.ball.getData('onpowerplayer'))
		{
			console.log("the player hit me bitch");
			this.powerup = true;
			this.ballpower.setPosition(-100, this.scale.height + 100);
			this.powerUpPlayer();
		}
	});
}

	powerUpEnemy()
	{

		switch (power) {
      case 1:
			this.enemy.setScale(0.55, 0.50);
			this.time.delayedCall(10000, () => {
				this.enemy.setScale(0.55, 0.25);
				this.powerup = false;
			});
			break;
      case 2:
			this.player.setScale(0.55, 0.15);
			this.time.delayedCall(10000, () => {
				this.player.setScale(0.55, 0.25);
				this.powerup = false;
			});
			break;
      case 3:
				SPEEDE = 600;
        this.time.delayedCall(10000, () => {
          SPEEDE = 300;
          this.powerup = false;
        });
				break;
		}
	}

	powerUpPlayer()
	{		
		switch (power) {
      case 1:
			this.player.setScale(0.55, 0.50);
			this.time.delayedCall(10000, () => {
				this.player.setScale(0.55, 0.25);
				this.powerup = false;
			});
			break;
      case 2:
			this.enemy.setScale(0.55, 0.15);
			this.time.delayedCall(10000, () => {
				this.enemy.setScale(0.55, 0.25);
				this.powerup = false;
			});
			break;
			case 3:
				SPEEDP = 600;
        this.time.delayedCall(10000, () => {
          SPEEDP = 300;
          this.powerup = false;
        });
				break;
		}
	}

  ballLost() {
    if (this.ball.x >= this.scale.width)
      this.randomCheer();
    else
      this.randomBoo();
	this.ball.setData('onpowerenemy', false);
	this.ball.setData('onpowerplayer', false);
    this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
    this.ball.setVelocity(-200, 0);
  }

  stopSound() {
    this.cheer1.stop();
    this.cheer2.stop();
    this.cheer3.stop();
    this.cheer4.stop();
    this.boo1.stop();
    this.boo2.stop();
  }

  endGame() {
    if (this.score1 === 5 || this.score2 === 5) {
      this.stopSound();
      const winner = this.score1 === 5 ? 'Player 1' : 'Player 2';
      this.scene.start('EndScene', { score1: this.score1, score2: this.score2, winner: winner });
    }
  }

  randomBoo() {
    const randomSound = Phaser.Math.Between(1, 2);
    this.stopSound();

    switch (randomSound) {
      case 1:
        this.boo1.play();
        break;
      case 2:
        this.boo2.play();
        break;
    }
  }

  randomCheer() {
    const randomSound = Phaser.Math.Between(1, 4);
    this.stopSound();

    switch (randomSound) {
      case 1:
        this.cheer1.play("duration");
        break;
      case 2:
        this.cheer2.play();
        break;
      case 3:
        this.cheer3.play();
        break;
      case 4:
        this.cheer4.play();
        break;
    }

}

randomPowerUp() {
  power = Phaser.Math.Between(1, 3);

  switch (power) {
    case 1:
      this.ballpower.setTexture('big');
      break;
      case 2:
        this.ballpower.setTexture('small');
        break;
        case 3:
          this.ballpower.setTexture('speed');
      break;
  }
}
	powerupreposition() 
	{
		if ((this.ballpower.y > this.scale.height || this.ballpower.y < -101) && this.powerup == false)
		{
			
			this.time.delayedCall(3000, () => {
				this.ballpower.setPosition(this.scale.width / 2, -100);
        console.log("am here");
        this.randomPowerUp();
        console.log("am here");
				this.ballpower.setVelocity(0, 50);
			});
		}
	}

}

