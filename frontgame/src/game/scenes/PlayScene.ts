import { Scene } from 'phaser';
const SPEED = 300;
export default class PlayScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemy!: Phaser.Physics.Arcade.Sprite;
  private ball!: Phaser.Physics.Arcade.Sprite;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key };
  private score1!: number;
  private score2!: number;
  private scoreText1!: Phaser.GameObjects.Text;
  private scoreText2!: Phaser.GameObjects.Text;
  private ballSound!: Phaser.Sound.BaseSound;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  constructor () {
    super({ key: 'PlayScene' })
  }
  
  init () {
    this.score1 = 0;
    this.score2 = 0;
  }
  
  create () {
    this.add.image(400, 300, 'sky');
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

    // Score text
    this.scoreText1 = this.add.text(16, 16, '0', { fontSize: '32px'})
    this.scoreText2 = this.add.text(this.scale.width -50, 16, '0', { fontSize: '32px'})
    // audio
    this.ballSound = this.sound.add('pong');
    // emitter
    this.emitter = this.add.particles(this.ball.x, this.ball.y, 'flares', {
      // frame: { frames: [ 'red', 'green', 'blue', 'white', 'yellow' ], cycle: true },
      blendMode: 'ADD',
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300, // Durata di vita delle particelle (in millisecondi)
      frequency: 100, // Frequenza di emissione delle particelle (in millisecondi)
      // follow: this.ball // Seguire l'oggetto della palla
  });
  }
  
  update () {
    this.movePlayer();
    this.moveEnemy();
    this.ballCollision();
    this.endGame();
    this.emitter.setPosition(this.ball.x, this.ball.y);
    
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
    this.physics.world.collide(this.player, this.ball, () => { this.ball.setData('onPaddlePlayer', true); this.ballSound.play(); this.emitter.explode(10)});
    this.physics.world.collide(this.enemy, this.ball, () => { this.ball.setData('onPaddleEnemy', true); this.ballSound.play(); this.emitter.explode(10)});
    
  }

  ballLost() {
    this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
    this.ball.setVelocity(-200, 0);
  }

  endGame() {
    if (this.score1 === 5 || this.score2 === 5) {
      const winner = this.score1 === 5 ? 'Player 1' : 'Player 2';
      this.scene.start('EndScene', { score1: this.score1, score2: this.score2, winner: winner });
    }
  }
}


