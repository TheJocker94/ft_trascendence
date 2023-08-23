import { Scene } from 'phaser';
import { socketGame } from '@/plugins/Socket.io';
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref } from 'vue';

const userStore = ref(useCurrentUserStore());


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
  private ballPos: { x: number; y: number };
  private ballVel: { x: number; y: number };
  private dashedLine!: Phaser.GameObjects.Graphics;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key };
  private score1!: number;
  private score2!: number;
  private scoreText1!: Phaser.GameObjects.Text;
  private scoreText2!: Phaser.GameObjects.Text;
  private ballSound!: Phaser.Sound.BaseSound;
  private soundtrack!: Phaser.Sound.BaseSound;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private shape1!: Phaser.Geom.Circle;
  private gol: boolean = false;

  private lee1!: Phaser.Sound.BaseSound;
  private lee2!: Phaser.Sound.BaseSound;
  private lee3!: Phaser.Sound.BaseSound;
  private lee4!: Phaser.Sound.BaseSound;
  private lee5!: Phaser.Sound.BaseSound;
  private lee6!: Phaser.Sound.BaseSound;
  private nizz1!: Phaser.Sound.BaseSound;
  private nizz2!: Phaser.Sound.BaseSound;
  private nizz3!: Phaser.Sound.BaseSound;
  private nizz4!: Phaser.Sound.BaseSound;
  private nizz5!: Phaser.Sound.BaseSound;

  constructor() {
    super({ key: 'PlayScene' })
    this.shape1 = new Phaser.Geom.Circle(0, 0, 0);
    this.ballPos = { x: 400, y: 300 };
    this.ballVel = { x: -200, y: 0 };
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
    this.ball = this.physics.add.sprite(this.ballPos.x, this.ballPos.y, 'ball');
    this.ball.setVelocity(this.ballVel.x, this.ballVel.y);
    this.ball.setData('onPaddlePlayer', false);
    this.ball.setData('onPaddleEnemy', false);
    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);

    // Score text
    this.scoreText1 = this.add.text(this.scale.width / 2 - 75, 16, '0', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    this.scoreText2 = this.add.text(this.scale.width / 2 + 50, 16, '0', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    // audio
    this.ballSound = this.sound.add('pong');
    this.lee1 = this.sound.add('lee1');
    this.lee2 = this.sound.add('lee2');
    this.lee3 = this.sound.add('lee3');
    this.lee4 = this.sound.add('lee4');
    this.lee5 = this.sound.add('lee5');
    this.lee6 = this.sound.add('lee6');
	this.nizz1 = this.sound.add('nizz1');
    this.nizz2 = this.sound.add('nizz2');
    this.nizz3 = this.sound.add('nizz3');
    this.nizz4 = this.sound.add('nizz4');
    this.nizz5 = this.sound.add('nizz5');
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

    // event listener movement
    socketGame.on('move', (data: { direction: string, player: number, room: string}) => {
      console.log(data);
      console.log("i am in game")
      if (data.room === userStore.value.roomId) {
        if (data.player === 1){
          if (data.direction === 'up')
            this.enemy.setVelocityY(-SPEED);
          else if (data.direction === 'down')
            this.enemy.setVelocityY(SPEED);
          else
            this.enemy.setVelocityY(0);
        }
        else if (data.player === 2){
          if (data.direction === 'up')
            this.player.setVelocityY(-SPEED);
          else if (data.direction === 'down')
            this.player.setVelocityY(SPEED);
          else
            this.player.setVelocityY(0);
        }
      }
    });

    // Update ball position from backend
    socketGame.on('ballUpdateServer', (data: { x: number, y: number, velX: number, velY: number, room: string }) => {
      if (data.room === userStore.value.roomId) {
        this.ball.setPosition(data.x, data.y);
        this.ball.setVelocity(data.velX, data.velY);
      }
    });


  }
  update() {

    // this.dashedLine.clear();

    // this.dashedLine.lineStyle(2, 0xffffff, 1);
    // this.dashedLine.setOrigin(0, 0);

    // for (let y = 0; y < this.scale.height; y += 20) {
    //   this.dashedLine.moveTo(this.scale.width / 2, y);
    //   this.dashedLine.lineTo(this.scale.width / 2, y + 10);
    // }
    // this.ballUpdate();
    console.log(this.ball.body!.velocity.x);
    if (this.ball.body!.velocity.x > 900 || this.ball.body!.velocity.x < -900) {
      console.log("am i here bitch");
      if (this.ball.body!.velocity.x > 0){
        this.ball.body!.velocity.x = this.ballVel.x = 900;
        this.ballUpdate();
      }
      else{
        this.ball.body!.velocity.x = this.ballVel.x =-900;
        this.ballUpdate();
      }
      // this.ball.setVelocityX(-1000);
    }
    this.movePlayer();
    // this.moveEnemy();
    this.ballCollision();
    this.endGame();
    if (this.ball.y <= 5 || this.ball.y >= this.scale.height - 5) {
      this.ballSound.play();
    }
    this.emitter.setPosition(this.ball.x, this.ball.y);
    this.emitter.addEmitZone({ type: 'edge', source: this.shape1, quantity: 64, total: 1 });
    if (this.ball.getData('onPaddlePlayer')) {
      // this.ballVel.x = (Math.random() * 50) + this.player.body!.velocity.y;
      // this.ballVel.y = this.ballVel.x + (0.1) * this.ballVel.x;
      this.ball.setVelocityY((Math.random() * 50) + this.player.body!.velocity.y);
      this.ball.setVelocityX(this.ball.body!.velocity.x + (0.1) * this.ball.body!.velocity.x);
      this.ball.setData('onPaddlePlayer', false);
      this.ballUpdate()
    } else if (this.ball.getData('onPaddleEnemy')) {
      // this.ballVel.x = (Math.random() * 50) + this.enemy.body!.velocity.y;
      // this.ballVel.y = this.ballVel.x + (0.1) * this.ball.body!.velocity.x
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
    if (this.cursor.up.isDown || this.wasd.up.isDown){
      socketGame.emit('movePlayer', { direction: 'up', player: userStore.value.playerNo, room: userStore.value.roomId
    });

    }
    else if (this.cursor.down.isDown || this.wasd.down.isDown){
      socketGame.emit('movePlayer', { direction: 'down', player: userStore.value.playerNo, room: userStore.value.roomId });

    }
    else{
        socketGame.emit('movePlayer', { direction: 'none', player: userStore.value.playerNo, room: userStore.value.roomId });
    }
  }

  ballCollision() {
    this.ball.setData('onPaddlePlayer', false);
    this.ball.setData('onPaddleEnemy', false);
    this.physics.world.collide(this.player, this.ball, () => { this.ball.setData('onPaddlePlayer', true); this.randomPlayer()});
    this.physics.world.collide(this.enemy, this.ball, () => { this.ball.setData('onPaddleEnemy', true); this.randomEnemy()});

  }

  ballLost() {
    if (this.ball.x >= this.scale.width)
	{
		this.stopSound();
		this.lee6.play();
	}
    else
	{
		this.stopSound();
		this.nizz5.play();
	}
    this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
    if (!this.gol)
      this.ball.setVelocity(-200, 0);
    else
      this.ball.setVelocity(200, 0);
    this.ballUpdate()
  }

  ballUpdate() {
    socketGame.emit('ballUpdate', { x: this.ball.x, y: this.ball.y, velX: this.ball.body!.velocity.x, velY: this.ball.body!.velocity.y, room: userStore.value.roomId });
  }

  stopSound() {
    this.lee1.stop();
    this.lee2.stop();
    this.lee3.stop();
    this.lee4.stop();
    this.lee5.stop();
    this.lee6.stop();
	this.nizz1.stop();
    this.nizz2.stop();
    this.nizz3.stop();
    this.nizz4.stop();
    this.nizz5.stop();
  }

  endGame() {
    if (this.score1 === 5 || this.score2 === 5) {
      this.stopSound();
      const winner = this.score1 === 5 ? 'Player 1' : 'Player 2';
      this.soundtrack.stop();
      this.scene.start('EndScene', { score1: this.score1, score2: this.score2, winner: winner });
    }
  }

  randomPlayer() {
    const randomSound = Phaser.Math.Between(1, 5);
    this.stopSound();

    switch (randomSound) {
      case 1:
        this.lee1.play();
        break;
      case 2:
        this.lee2.play();
        break;
      case 3:
        this.lee3.play();
        break;
      case 4:
        this.lee4.play();
        break;
      case 5:
        this.lee5.play();
        break;
    }
  }

	randomEnemy()
	{
		const randomSound = Phaser.Math.Between(1, 4);
		this.stopSound();

		switch (randomSound)
		{
			case 1:
				this.nizz1.play();
				break;
			case 2:
				this.nizz2.play();
				break;
			case 3:
				this.nizz3.play();
				break;
			case 4:
				this.nizz4.play();
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

