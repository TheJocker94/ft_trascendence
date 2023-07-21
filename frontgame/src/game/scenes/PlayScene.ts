import { Scene } from 'phaser';
// import { Circle, Rectangle, Intersects } from 'phaser';

export default class PlayScene extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private emitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  // private paddle1!: Phaser.Physics.Arcade.Image;
  // private paddle2!: Phaser.Physics.Arcade.Image;
  private paddle1!: Phaser.GameObjects.Rectangle;
  private paddle2!: Phaser.GameObjects.Rectangle;
  // private ball!:  Phaser.Physics.Arcade.Image;
  private ball!: Phaser.GameObjects.Arc;
  private ballVelocity!: Phaser.Math.Vector2;
  private score1!: number;
  private score2!: number;
  private scoreText1!: Phaser.GameObjects.Text;
  private scoreText2!: Phaser.GameObjects.Text;
  private scoreSound!: Phaser.Sound.BaseSound;

//   private circleRectCollision(ball: Phaser.GameObjects.Arc, paddle: Phaser.GameObjects.Rectangle) {
//     var distX = Math.abs(ball.x - paddle.x - paddle.width / 2);
//     var distY = Math.abs(ball.y - paddle.y - paddle.height / 2);

//     if (distX > (paddle.width / 2 + ball.radius)) { return false; }
//     if (distY > (paddle.height / 2 + ball.radius)) { return false; }

//     if (distX <= (paddle.width / 2)) { return true; }
//     if (distY <= (paddle.height / 2)) { return true; }

//     var dx = distX - paddle.width / 2;
//     var dy = distY - paddle.height / 2;
//     return (dx * dx + dy * dy <= (ball.radius * ball.radius));
// }
  
  constructor () {
    super({ key: 'PlayScene' })
  }
  
  init () {
    this.score1 = 0
    this.score2 = 0
  }
  
  create () {
    this.add.image(400, 300, 'sky')
    this.cursors = this.input.keyboard!.createCursorKeys()
    this.paddle1 = this.add.rectangle(10, 300, 15, 100, 0xffffff)
    this.paddle2 = this.add.rectangle(790, 300, 15, 100, 0xffffff)
    // this.paddle1 = this.physics.add.image(20, 300, 'paddle')
    // this.paddle2 = this.physics.add.image(780, 300, 'paddle')
    this.physics.add.existing(this.paddle1, true)
    this.physics.add.existing(this.paddle2, true)
    this.ball = this.add.circle(400, 300, 7, 0xffffff)
    this.physics.add.existing(this.ball, true)
    // this.ball = this.physics.add.image(400, 200, 'bomb')
    // this.ball.setCollideWorldBounds(true)
    this.physics.add.collider(this.paddle1, this.ball)
    this.physics.add.collider(this.paddle2, this.ball)
    this.ballVelocity = new Phaser.Math.Vector2(-10, -10)
    this.scoreText1 = this.add.text(16, 16, '0', { fontSize: '32px'})
    this.scoreText2 = this.add.text(750, 16, '0', { fontSize: '32px'})
    this.scoreSound = this.sound.add('thud')
    
    this.sound.add('thud')
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
    
  //   if (this.circleRectCollision(this.ball, this.paddle1) || this.circleRectCollision(this.ball, this.paddle2)) {
  //     // this.scoreSound.play()
  //     this.ballVelocity.x *= -1

  //     // Additional logic to prevent ball from going into the paddle
  //     let diff = 0;

  //     if (this.ball.y < this.paddle1.y) {
  //         // If ball is in the top half of the paddle
  //         diff = this.paddle1.y - this.ball.y;
  //         this.ballVelocity.y = -10 * diff;
  //     } else if (this.ball.y > this.paddle1.y) {
  //         // If ball is in the bottom half of the paddle
  //         diff = this.ball.y - this.paddle1.y;
  //         this.ballVelocity.y = 10 * diff;
  //     }
  // }
    // You can use the class properties here
    this.emitter.setPosition(this.ball.x, this.ball.y)
    if (this.cursors.up!.isDown && this.paddle1.y > 50) {
      this.paddle1.y -= 10
    }
    else if (this.cursors.down!.isDown && this.paddle1.y < 550) {
      this.paddle1.y += 10
    }
    if (this.paddle2.y < this.ball.y) {
      this.paddle2.y += 5
    }
    else if (this.paddle2.y > this.ball.y) {
      this.paddle2.y -= 5
    }

    this.ball.x +=  this.ballVelocity.x * 2/3
    this.ball.y += this.ballVelocity.y  * 2/3


    if (Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle1.getBounds())) {
      this.ballVelocity.x = Math.abs(this.ballVelocity.x);
      this.ball.x = this.paddle1.x + this.paddle1.width/2 + this.ball.width/2; // Equivalent to ball.left = paddleLeft.right
  }
  if (Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle2.getBounds())) {
      this.ballVelocity.x = -Math.abs(this.ballVelocity.x);
      this.ball.x = this.paddle2.x - this.paddle2.width/2 - this.ball.width/2; // Equivalent to ball.right = paddleRight.left
  }
  
    // if (Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle1.getBounds()))
    // {
    //   this.ballVelocity.x = Math.abs(this.ballVelocity.x);
    // }
    // if (Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle2.getBounds()))
    // {
    //   this.ballVelocity.x = -Math.abs(this.ballVelocity.x);
    // }
        if (this.ball.y <= 0 || this.ball.y >= 600) {
          this.ballVelocity.y *= -1
        }

        if (this.ball.x < 0 || this.ball.x > 800) {
          if (this.ball.x < 0) {
            this.score2 += 1
            this.scoreText2.setText(this.score2.toString())
            // this.scoreSound.play()
          }
          else if (this.ball.x > 800) {
            this.score1 += 1
            this.scoreText1.setText(this.score1.toString())
            // this.scoreSound.play()
          }
          this.ball.x = 400
          this.ball.y = 300
        }

        if (this.score1 == 5) {
          this.scene.start('EndScene', { winner: 'Player 1' })
        }
        else if (this.score2 == 5) {
          this.scene.start('EndScene', { winner: 'Player 2' })
        }
  }
}
