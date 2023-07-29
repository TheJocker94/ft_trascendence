import { Scene } from 'phaser';
const SPEED = 300;
// dopo una certa velocità la palla non rimbalza più e passa attraverso il muro //*FIXED*
// idea: creare una animazione che rompe il muro quando la palla lo colpisce

// se non sai cosa fare aggiustare suono pallina che parte in ritardo

// idee powerup:
// - palla che rallenta
// - palla che accelera
// - palla che si divide in due
// - palla che si allunga
// - palla che si rimpicciolisce
// - palla che si ferma
// - palla che si teletrasporta
// - palla che si muove in modo casuale
// - palla che si muove in modo casuale ma non oltre una certa distanza
// - palla che si muove in modo casuale ma non oltre una certa distanza e non oltre una certa velocità
// - muro che si allunga
// - muro che si rimpicciolisce

// idee modalità:
// modalita senza potenziamenti
// modalità con potenziamenti


export default class PlayScene extends Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private enemy!: Phaser.Physics.Arcade.Sprite;
  private ball!: Phaser.Physics.Arcade.Sprite;
  private dashedLine!: Phaser.GameObjects.Graphics;
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
  private gol: boolean = false;

  constructor() {
    super({ key: 'PlayScene' })
    this.shape1 = new Phaser.Geom.Circle(0, 0, 0);
    // this.shape1 = new Phaser.Geom.Circle(this.scale.width / 2, this.scale.height / 2, 160);
  }

  init() {
    this.score1 = 0;
    this.score2 = 0;
  }

  create() {
    // const background = this.add.image(0, 0, 'sky');
    // background.setOrigin(0, 0);
    // background.displayWidth = this.scale.width;
    // background.displayHeight = this.scale.height;

    // this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
    //   background.displayWidth = gameSize.width;
    //   background.displayHeight = gameSize.height;

    //   // Ensure other necessary elements are resized or repositioned here.
    //   // Examples:
    //   this.player.setPosition(30, gameSize.height / 2);
    //   this.enemy.setPosition(gameSize.width - 30, gameSize.height / 2);
    //   this.ball.setPosition(gameSize.width / 2, gameSize.height / 2);
    //   this.scoreText2.setPosition(gameSize.width - 50, 16);
    // });
    //! this.add.image(this.scale.width / 2, this.scale.height / 2, 'sky').setOrigin(0);
    const background = this.add.image(0, 0, 'matrix');
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

    // Score text
    this.scoreText1 = this.add.text(this.scale.width / 2 - 75, 16, '0', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    this.scoreText2 = this.add.text(this.scale.width / 2 + 50, 16, '0', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
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
      frame: { frames: ['red', 'green', 'blue', 'white', 'yellow'], cycle: true },
      blendMode: 'ADD',
      angle: { min: 0, max: 360 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300, // Durata di vita delle particelle (in millisecondi)
      frequency: 100, // Frequenza di emissione delle particelle (in millisecondi)
      // follow: this.ball // Seguire l'oggetto della palla
    });
    // Create the dashed line
    this.dashedLine = this.add.graphics();

    // Set dashed line properties
    this.dashedLine.lineStyle(4, 0xffffff, 1);

    // Draw the dashed line from top to bottom of the screen
    const halfScreenWidth = this.scale.width / 2;
    const screenHeight = this.scale.height;
    const dashLength = 10;
    for (let y = 0; y < screenHeight; y += dashLength * 2) {
      this.dashedLine.moveTo(halfScreenWidth, y);
      this.dashedLine.lineTo(halfScreenWidth, y + dashLength);
    }

    // Render the dashed line on the screen
    this.dashedLine.strokePath();
  }
  update() {

    // this.dashedLine.clear();

    // this.dashedLine.lineStyle(2, 0xffffff, 1);
    // this.dashedLine.setOrigin(0, 0);

    // for (let y = 0; y < this.scale.height; y += 20) {
    //   this.dashedLine.moveTo(this.scale.width / 2, y);
    //   this.dashedLine.lineTo(this.scale.width / 2, y + 10);
    // }

    console.log(this.ball.body!.velocity.x);
    if (this.ball.body!.velocity.x > 900 || this.ball.body!.velocity.x < -900) {
      console.log("am i here bitch");
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
    if (this.ball.y <= 5 || this.ball.y >= this.scale.height - 5) {
      this.ballSound.play();
    }
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
        this.gol = true;
        this.scoreText1.setText(this.score1.toString());
        this.animateScoreText(this.scoreText1);
      } else {
        this.score2++;
        this.gol = false;
        this.scoreText2.setText(this.score2.toString());
        this.animateScoreText(this.scoreText2);
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
    this.physics.world.collide(this.player, this.ball, () => { this.ball.setData('onPaddlePlayer', true); this.ballSound.play()/*; this.emitter.explode(10)*/ });
    this.physics.world.collide(this.enemy, this.ball, () => { this.ball.setData('onPaddleEnemy', true); this.ballSound.play()/*; this.emitter.explode(10)*/ });

  }

  ballLost() {
    if (this.ball.x >= this.scale.width)
      this.randomCheer();
    else
      this.randomBoo();
    this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
    if (!this.gol)
      this.ball.setVelocity(-200, 0);
    else
      this.ball.setVelocity(200, 0);
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

  animateScoreText(scoreText: Phaser.GameObjects.Text) {
    this.tweens.add({
      targets: scoreText,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        scoreText.setScale(1);
      },
    });
  }



}

