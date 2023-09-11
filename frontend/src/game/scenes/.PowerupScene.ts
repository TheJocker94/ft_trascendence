import { Scene } from 'phaser';
const SPEED = 300;


export default class PlayScene extends Scene {
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
  private shape1!: Phaser.Geom.Circle;

  constructor () {
    super({ key: 'PlayScene' })
	this.shape1 = new Phaser.Geom.Circle(0, 0, 0);
	// this.shape1 = new Phaser.Geom.Circle(this.scale.width / 2, this.scale.height / 2, 160);
  }

  init () {
    this.score1 = 0;
    this.score2 = 0;
  }
  
  create () {
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
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);

	// Load ballpower
	this.ballpower = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ballpower');
	this.ballpower.setVelocity(-200, 0);
	this.ballpower.setData('onPaddlePlayer', false);
	this.ballpower.setData('onPaddleEnemy', false);
	this.ballpower.setBounce(1);
	this.ballpower.setCollideWorldBounds(true);

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
    this.soundtrack.play();
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
  }
  
  update () {
	if (this.ball.body!.velocity.x > 900 || this.ball.body!.velocity.x < -900) {
		if (this.ball.body!.velocity.x > 0)
		this.ball.body!.velocity.x = 900;
		else
		this.ball.body!.velocity.x = -900;
	}
    this.movePlayer();
    this.moveEnemy();
    this.ballCollision();
    this.endGame();
    this.emitter.setPosition(this.ball.x, this.ball.y);
    this.emitter.addEmitZone({ type: 'edge', source: this.shape1, quantity: 64, total: 1 });
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
      this.player.setVelocityY(-SPEED);
    else if (this.wasd.down.isDown)
      this.player.setVelocityY(SPEED);
    else
      this.player.setVelocityY(0);
  }

  moveEnemy() {
    if (this.cursor.up.isDown)
      this.enemy.setVelocityY(-SPEED);
    else if (this.cursor.down.isDown)
      this.enemy.setVelocityY(SPEED);
    else
      this.enemy.setVelocityY(0);
  }

  ballCollision() {
    this.ball.setData('onPaddlePlayer', false);
    this.ball.setData('onPaddleEnemy', false);
  this.physics.world.collide(this.player, this.ball, () => { this.ball.setData('onPaddlePlayer', true); this.ballSound.play()/*; this.emitter.explode(10)*/});
    this.physics.world.collide(this.enemy, this.ball, () => { this.ball.setData('onPaddleEnemy', true); this.ballSound.play()/*; this.emitter.explode(10)*/});
    
  }

  ballLost() {
    if (this.ball.x >= this.scale.width)
      this.randomCheer();
    else
      this.randomBoo();
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

}

