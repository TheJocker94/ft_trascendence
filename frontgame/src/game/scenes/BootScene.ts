import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
import bomb from '@/game/assets/bomb.png'
import pong from '@/game/assets/pong.mp3'
import thudMp3 from '@/game/assets/thud.mp3'
import thudOgg from '@/game/assets/thud.ogg'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', sky)
    this.load.image('bomb', bomb)
    this.load.atlas('flares', 'https://labs.phaser.io/assets/particles/flares.png', 'https://labs.phaser.io/assets/particles/flares.json')
    this.load.image('paddle', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png')
    this.load.audio('thud', [thudMp3, thudOgg])
    this.load.audio('pong', pong)

  }

  create () {
    this.scene.start('PlayScene')
  }
}
