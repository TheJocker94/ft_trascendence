import { Scene } from 'phaser';
import { socketGame } from '@/plugins/Socket.io';
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref, onMounted } from 'vue';

const isBrowserMinimized = ref(false);
onMounted(() => {
	document.addEventListener('visibilitychange', handleVisibilityChange);
  });
  const handleVisibilityChange = () => {
	isBrowserMinimized.value = document.hidden;
  };

const userStore = ref(useCurrentUserStore());
let SPEEDP = 300;
let SPEEDE = 300;
let power = 1;
let boomX = 0;
let boomY = 0;

export default class PowerupScene extends Scene {
  private player1!: Phaser.Physics.Arcade.Sprite;
  private player2!: Phaser.Physics.Arcade.Sprite;
  private ball!: Phaser.Physics.Arcade.Sprite;
  private ballpower!: Phaser.Physics.Arcade.Sprite;
  private dashedLine!: Phaser.GameObjects.Graphics;
	private veil!: Phaser.GameObjects.Rectangle;
  private cursor!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: { up: Phaser.Input.Keyboard.Key; down: Phaser.Input.Keyboard.Key };
  private score1!: number;
  private score2!: number;
  private scoreText1!: Phaser.GameObjects.Text;
  private scoreText2!: Phaser.GameObjects.Text;
  private user1!: Phaser.GameObjects.Text;
  private user2!: Phaser.GameObjects.Text;
  private pauseText!: Phaser.GameObjects.Text;
  private ballSound!: Phaser.Sound.BaseSound;
  private thud!: Phaser.Sound.BaseSound;
  private soundtrack!: Phaser.Sound.BaseSound;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private shape1!: Phaser.Geom.Circle;
  private powerup!: boolean;
  private explosion!: Phaser.Physics.Arcade.Sprite;
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
    super({ key: 'PowerupScene' })
    this.shape1 = new Phaser.Geom.Circle(0, 0, 0);
  }

  init() {
    this.score1 = 0;
    this.score2 = 0;
    this.powerup = false;

  }

  create() {

    // Background
    const background = this.add.image(0, 0, 'matrix');
    background.setOrigin(0, 0);  // Set the origin to the top-left corner
    // veil
		this.veil = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5);
		this.veil.setOrigin(0, 0);
		this.veil.setDepth(1);
		this.veil.setVisible(false);

		// Game key input
    // Arrows
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.cursor = this.input.keyboard!.createCursorKeys();

    // WASD
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
    };

    // Load player1
    this.player1 = this.physics.add.sprite(30, this.scale.height / 2, 'wall');
    this.player1.setOrigin(0.5, 0.5);
    this.player1.setScale(0.55, 0.25);
    this.player1.setCollideWorldBounds(true);
    this.player1.setImmovable(true);

    // Load player2
    this.player2 = this.physics.add.sprite(this.scale.width - 30, this.scale.height / 2, 'wall');
    this.player2.setOrigin(0.5, 0.5);
    this.player2.setScale(0.55, 0.25);
    this.player2.setCollideWorldBounds(true);
    this.player2.setImmovable(true);

    // Load ball
    this.ball = this.physics.add.sprite(this.scale.width / 2, this.scale.height / 2, 'ball');
    this.ball.setVelocity(-200, 0);
    this.ball.setData('onPaddlePlayer1', false);
    this.ball.setData('onPaddlePlayer2', false);

    this.ball.setData('onpowerplayer1', false);
    this.ball.setData('onpowerPlayer2', false);

    this.ball.setBounce(1);
    this.ball.setCollideWorldBounds(true);

    socketGame.on('powerupServer', (data: { power: number, room: string }) => {
      if (data.room === userStore.value.roomId) {
        power = data.power;
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
    });
    // Load ballpower
    // if (userStore.value.playerNo === 1)
    //   socketGame.emit('powerup', { room: userStore.value.roomId });

    this.ballpower = this.physics.add.sprite(this.scale.width / 2, 10, 'big');
    this.ballpower.setDepth(1);
    this.ballpower.setScale(2, 2);
    this.ballpower.setVelocity(0, 50);

    // this.ballpower.setBounce(0);

    // Score text
    this.scoreText1 = this.add.text(this.scale.width / 2 - 75, 16, '0', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    this.scoreText2 = this.add.text(this.scale.width / 2 + 50, 16, '0', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    this.user1 = this.add.text(this.scale.width / 4 , 16, userStore.value.username1.substring(0, 10), { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    this.user2 = this.add.text(this.scale.width / 4 * 3, 16, userStore.value.username2.substring(0, 10), { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' })
    this.user1.setOrigin(0.5, 0);
    this.user2.setOrigin(0.5, 0);
    // Pause text
		this.pauseText = this.add.text(this.scale.width / 2, this.scale.height / 2, 'Waiting for the other player', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff' }).setOrigin(0.5)
		this.pauseText.setDepth(1);
		this.pauseText.setVisible(false);
		// audio
    this.ballSound = this.sound.add('pong');
    this.thud = this.sound.add('thud');
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
    });

    //initialize the explosion
    this.explosion = this.physics.add.sprite(0, 0, 'boom');
    this.explosion.setScale(2, 2);
    this.explosion.setVisible(false);
    this.explosion.on('animationcomplete', () => {
      this.explosion.setVisible(false);
    })

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
    //Server event listeners
    socketGame.on('move', (data: { direction: string, player: number, room: string}) => {
      if (data.room === userStore.value.roomId) {
        if (data.player === 1){
          if (data.direction === 'up')
            this.player1.setVelocityY(-SPEEDP);
          else if (data.direction === 'down')
            this.player1.setVelocityY(SPEEDP);
          else
            this.player1.setVelocityY(0);
        }
        else if (data.player === 2){
          if (data.direction === 'up')
            this.player2.setVelocityY(-SPEEDE);
          else if (data.direction === 'down')
            this.player2.setVelocityY(SPEEDE);
          else
            this.player2.setVelocityY(0);
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
    socketGame.on('powerballUpdateServer', (data: { x: number, y: number, velX: number, velY: number, room: string }) => {
      if (data.room === userStore.value.roomId) {
        this.ballpower.setPosition(data.x, data.y);
        this.ballpower.setVelocity(data.velX, data.velY);
      }
    });

    socketGame.on('powerdoitServer', (data: { player: number, room: string, x: number, y: number }) => {
			boomX = data.x;
			boomY = data.y;
      this.powerup = true;
      if (data.room === userStore.value.roomId) {
        if (data.player === 1) {
          this.boombaby();
          this.powerUpPlayer();
        }
        else if (data.player === 2) {
          this.boombaby();
          this.powerUpEnemy();
        }
        this.ball.setData('onpowerplayer1', false);
        this.ball.setData('onpowerplayer2', false);
        this.powerballUpdate();
      }
    });

    socketGame.on('updateScoreServer', (data: { score1: number, score2: number, room: string}) => {
      if (data.room === userStore.value.roomId) {
        this.ball.setData('onpowerplayer2', false);
        this.ball.setData('onpowerplayer1', false);
        if ( this.score1 !== data.score1)
        {
          this.stopSound();
          this.nizz5.play();
          this.score1 = data.score1;
          this.gol = true;
          this.scoreText1.setText(this.score1.toString());
          this.animateScoreText(this.scoreText1);
        }
        else if (this.score2 !== data.score2)
        {
          this.stopSound();
          this.lee6.play();
          this.score2 = data.score2;
          this.gol = false;
          this.scoreText2.setText(this.score2.toString());
          this.animateScoreText(this.scoreText2);
        }
      }
    })

    socketGame.on('hitPaddleServer', (data: {player: number, room: string}) => {
      if (data.room === userStore.value.roomId) {
        if (data.player === 1){
          this.ball.setData('onPaddlePlayer1', true);
          this.ball.setData('onpowerplayer2', false);
          this.ball.setData('onpowerplayer1', true); 
          this.randomPlayer();
        }
        else if (data.player === 2)
          this.ball.setData('onPaddlePlayer2', true);
          this.ball.setData('onpowerplayer1', false);
          this.ball.setData('onpowerplayer2', true); 
          this.randomEnemy();
      }
    })

	socketGame.on('pauseServer', (data: {room: string, player: number}) => {
		if (data.room === userStore.value.roomId)
		{
			this.ballpower.setDepth(0);
			this.pauseText.setVisible(true);
			this.veil.setVisible(true);
			this.scene.pause();
		}
  })
  
  socketGame.on('unpauseServer', (data: {room: string, player: number}) => {
		if (data.room === userStore.value.roomId)
		{
			this.ballpower.setDepth(1);
			this.pauseText.setVisible(false);
			this.veil.setVisible(false);
			this.scene.resume();
		}
	})
  }

  update() {

    if (userStore.value.playerNo === 1)
    {
      this.checkVelocity();
      this.powerupreposition();
      this.checkGol();
      this.ballCollision();
    }
    this.movePlayer();
    this.endGame();
    this.soundWall();
    this.emitter.setPosition(this.ball.x, this.ball.y);
    this.emitter.addEmitZone({ type: 'edge', source: this.shape1, quantity: 64, total: 1 });    
  }

  checkGol() {
    if (this.ball.x >= this.scale.width || this.ball.x <= 0) {
      if (this.ball.x >= this.scale.width) {
          this.updateScore(this.score1 + 1, this.score2);
          this.gol = true;
      } else {
        this.updateScore(this.score1, this.score2 + 1);
        this.gol = false;
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
      this.ball.setData('onPaddlePlayer1', false);
      this.ball.setData('onPaddlePlayer2', false);
      if (userStore.value.playerNo === 1)
      {
        this.physics.world.collide(this.player1, this.ball, () => { this.ball.setData('onPaddlePlayer1', true); this.ball.setData('onpowerplayer2', false); this.ball.setData('onpowerplayer1', true); this.paddleBallCollision();  socketGame.emit('hitPaddle', {player: 1, room: userStore.value.roomId}); /*this.randomPlayer();*/});
        this.physics.world.collide(this.player2, this.ball, () => { this.ball.setData('onPaddlePlayer2', true); this.ball.setData('onpowerplayer1', false); this.ball.setData('onpowerplayer2', true); this.paddleBallCollision();  socketGame.emit('hitPaddle', {player: 2, room: userStore.value.roomId}); /*this.randomEnemy();*/});  
        this.physics.world.overlap(this.ball, this.ballpower, () => { this.emitPowerup()});

      }
    }

  emitPowerup(){
      if (this.ball.getData('onpowerplayer2')=== true) {
        if (this.ball.body!.velocity.x > 0)
          socketGame.emit('powerdoit', {player: 1, room: userStore.value.roomId, x: this.ballpower.x, y: this.ballpower.y});
        else if (this.ball.body!.velocity.x < 0)
          socketGame.emit('powerdoit', {player: 2, room: userStore.value.roomId, x: this.ballpower.x, y: this.ballpower.y});
      }
      else if (this.ball.getData('onpowerplayer1')=== true) {
        if (this.ball.body!.velocity.x > 0)
          socketGame.emit('powerdoit', {player: 1, room: userStore.value.roomId, x: this.ballpower.x, y: this.ballpower.y});
        else if (this.ball.body!.velocity.x < 0)
          socketGame.emit('powerdoit', {player: 2, room: userStore.value.roomId, x: this.ballpower.x, y: this.ballpower.y});
    }
  }
    checkVelocity() {
      
      if (this.ball.body!.velocity.x > 700 || this.ball.body!.velocity.x < -700) {
        if (this.ball.body!.velocity.x > 0){
          this.ball.body!.velocity.x = 700;
          this.ballUpdate();
        }
        else{
          this.ball.body!.velocity.x = -700;
          this.ballUpdate();
        }
      }

    }
  paddleBallCollision(){
    if (userStore.value.playerNo === 1)
    {
      if (this.ball.getData('onPaddlePlayer1')) {
        this.ball.setVelocityY((Math.random() * 50) + this.player1.body!.velocity.y);
        this.ball.setVelocityX(this.ball.body!.velocity.x + (0.1) * this.ball.body!.velocity.x);
        this.ball.setData('onPaddlePlayer1', false);
        this.ballUpdate();
      } else if (this.ball.getData('onPaddlePlayer2')) {
        this.ball.setVelocityY((Math.random() * 50) + this.player2.body!.velocity.y);
        this.ball.setVelocityX(this.ball.body!.velocity.x + (0.1) * this.ball.body!.velocity.x);
        this.ball.setData('onPaddlePlayer2', false);
        this.ballUpdate();
      }
    }
  }

  boombaby() {
    this.thud.play();
    this.explosion.setPosition(boomX, boomY).setVisible(true).play('explode');
    this.ballpower.setPosition(-100, this.scale.height + 100);
  }

  powerUpEnemy() {
    switch (power) {
      case 1:
        this.player2.setScale(0.55, 0.50);
        this.time.delayedCall(10000, () => {
        this.player2.setScale(0.55, 0.25);
        this.powerup = false;
        });
        break;
      case 2:
        this.player1.setScale(0.55, 0.15);
        this.time.delayedCall(10000, () => {
        this.player1.setScale(0.55, 0.25);
        this.powerup = false;
        });
        break;
      case 3:
        SPEEDE = 500;
        this.time.delayedCall(10000, () => {
        SPEEDE = 300;
        this.powerup = false;
        });
        break;
    }
  }

  powerUpPlayer() {
    switch (power) {
      case 1:
        this.player1.setScale(0.55, 0.50);
        this.time.delayedCall(10000, () => {
        this.player1.setScale(0.55, 0.25);
        this.powerup = false;
        });
        break;
      case 2:
        this.player2.setScale(0.55, 0.15);
        this.time.delayedCall(10000, () => {
        this.player2.setScale(0.55, 0.25);
        this.powerup = false;
        });
        break;
      case 3:
        SPEEDP = 500;
        this.time.delayedCall(10000, () => {
        SPEEDP = 300;
        this.powerup = false;
        });
        break;
    }
  }
  soundWall(){
    if (this.ball.y <= 5 || this.ball.y >= this.scale.height - 5) {
      this.ballSound.play();
    }
  }
    
  ballLost() {
  this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
  if (!this.gol)
      this.ball.setVelocity(-200, 0);
  else
    this.ball.setVelocity(200, 0);
  this.ballUpdate();
  }

  ballUpdate() {
    socketGame.emit('ballUpdate', { x: this.ball.x, y: this.ball.y, velX: this.ball.body!.velocity.x, velY: this.ball.body!.velocity.y, room: userStore.value.roomId });
  }

  powerballUpdate() {
    socketGame.emit('powerballUpdate', { x: this.ballpower.x, y: this.ballpower.y, velX: this.ballpower.body!.velocity.x, velY: this.ballpower.body!.velocity.y, room: userStore.value.roomId });
  }

  updateScore(score1: number, score2: number) {
    socketGame.emit('updateScore', { score1: score1, score2: score2, room: userStore.value.roomId, mode: 'POWERUP'});
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
      SPEEDE = 300;
      SPEEDP = 300;
			power = 1;
      const winner = this.score1 === 5 ? 'Player 1' : 'Player 2';
      this.soundtrack.stop();
      socketGame.off('move');
      socketGame.off('ballUpdateServer');
      socketGame.off('powerballUpdateServer');
      socketGame.off('powerupServer');
      socketGame.off('powerdoitServer');
      socketGame.off('updateScoreServer');
      socketGame.off('hitPaddleServer');
	  socketGame.off('pauseServer');
	  socketGame.off('unpauseServer');
	  this.scene.stop('PowerupScene');
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

  randomPowerUp() {
    if (userStore.value.playerNo === 1)
    {
      socketGame.emit('powerup', { room: userStore.value.roomId });
    }
  }

  powerupreposition() {
    if ((this.ballpower.y > this.scale.height || this.ballpower.y < -101) && this.powerup == false) {

      this.time.delayedCall(3000, () => {
        this.ballpower.setPosition(this.scale.width / 2, -100);
        this.randomPowerUp();
        this.ballpower.setVelocity(0, 50);
        this.powerballUpdate();
      });
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

