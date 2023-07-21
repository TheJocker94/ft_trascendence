import { Scene } from 'phaser'

export default class PlayScene extends Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
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
    this.paddle1 = this.add.rectangle(15, 300, 5, 100, 0xffffff)
    this.paddle2 = this.add.rectangle(785, 300, 5, 100, 0xffffff)
    this.physics.add.existing(this.paddle1, true)
    this.physics.add.existing(this.paddle2, true)
    this.ball = this.add.circle(400, 300, 10, 0xffffff)
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
  }

  update () {
    if (this.cursors.up!.isDown && this.paddle1.y > 50) {
      this.paddle1.y -= 10
    }
    else if (this.cursors.down!.isDown && this.paddle1.y < 550) {
      this.paddle1.y += 10
    }
    if (this.paddle2.y < this.ball.y) {
      this.paddle2.y += 6
    }
    else if (this.paddle2.y > this.ball.y) {
      this.paddle2.y -= 6
    }

    this.ball.x +=  this.ballVelocity.x * 2/3
    this.ball.y += this.ballVelocity.y * 2/3

    if (Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle1.getBounds()) ||
            Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle2.getBounds())) {
              this.scoreSound.play()
              this.ballVelocity.x *= -1
        }
        if (this.ball.y <= 0 || this.ball.y >= 600) {
          this.ballVelocity.y *= -1
        }

        if (this.ball.x < 0 || this.ball.x > 800) {
          if (this.ball.x < 0) {
            this.score2 += 1
            this.scoreText2.setText(this.score2.toString())
            this.scoreSound.play()
          }
          else if (this.ball.x > 800) {
            this.score1 += 1
            this.scoreText1.setText(this.score1.toString())
            this.scoreSound.play()
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


// import Phaser from 'phaser'

// export default class PlayScene extends Phaser.Scene {
//   private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
//   private paddle1!: Phaser.GameObjects.Rectangle;
//   private paddle2!: Phaser.GameObjects.Rectangle;
//   private ball!: Phaser.GameObjects.Image;
//   private ballVelocity!: Phaser.Math.Vector2;
//   private score1!: number;
//   private score2!: number;
//   private scoreText1!: Phaser.GameObjects.Text;
//   private scoreText2!: Phaser.GameObjects.Text;
//   private scoreSound!: Phaser.Sound.BaseSound;

//   constructor() {
//     super('PlayScene')
//   }

//   create() {
//     this.add.image(400, 300, 'sky')
//     this.cursors = this.input.keyboard!.createCursorKeys()
//     this.paddle1 = this.add.rectangle(30, 300, 10, 100, 0xffffff)
//     this.paddle2 = this.add.rectangle(770, 300, 10, 100, 0xffffff)
//     this.ball = this.add.image(400, 200, 'bomb')
//     this.physics.add.collider(this.paddle1, this.ball)
//     this.physics.add.collider(this.paddle2, this.ball)
//     this.ballVelocity = new Phaser.Math.Vector2(-10, -10)
//     this.score1 = 0
//     this.score2 = 0
//     this.scoreText1 = this.add.text(16, 16, '0', { fontSize: '32px'})
//     this.scoreText2 = this.add.text(750, 16, '0', { fontSize: '32px'})
//     this.scoreSound = this.sound.add('thud')
//     // ... rest of the code ...
//   }

//   update() {
//     // You can use the class properties here
//     if (this.cursors.up!.isDown && this.paddle1.y > 50) {
//       this.paddle1.y -= 10
//     } else if (this.cursors.down!.isDown && this.paddle1.y < 550) {
//       this.paddle1.y += 10
//     }
//     if (this.paddle2.y < this.ball.y) {
//       this.paddle2.y += 6
//   } else if (this.paddle2.y > this.ball.y) {
//     this.paddle2.y -= 6
//   }

//     this.ball.x +=  this.ballVelocity.x
//     this.ball.y += this.ballVelocity.y

//     if (Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle1.getBounds()) ||
//             Phaser.Geom.Intersects.RectangleToRectangle(this.ball.getBounds(), this.paddle2.getBounds())) {
//               this.ballVelocity.x *= -1
//         }
//         if (this.ball.y <= 0 || this.ball.y >= 600) {
//           this.ballVelocity.y *= -1
//       }

//       if (this.ball.x < 0 || this.ball.x > 800) {
//         this.ball.x = 400
//         this.ball.y = 300
//       }
//       if (this.ball.x === 0) {
//         this.score2 += 1
//         this.scoreText2.setText(this.score2.toString())
//         this.scoreSound.play()
//       } else if (this.ball.x === 800) {
//         this.score1 += 1
//         this.scoreText1.setText(this.score1.toString())
//         this.scoreSound.play()
//       }

//       if (this.score1 == 5) {
//         this.scene.start('EndScene', { winner: 'Player 1' })
//       }
//       if (this.score2 === 5) {
//         this.scene.start('EndScene', { winner: 'Player 2' })
//       }
//   }
// }