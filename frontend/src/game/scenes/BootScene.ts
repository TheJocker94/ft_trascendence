import { Scene } from 'phaser'
import sky from '@/game/assets/sky.png'
// import bomb from '@/game/assets/bomb.png'
import pong from '@/game/assets/pong.mp3'
// import thudMp3 from '@/game/assets/thud.mp3'
// import thudOgg from '@/game/assets/thud.ogg'
import wall from '@/game/assets/wall.png'
import ball from '@/game/assets/ball.png'
import cheer1 from '@/game/assets/1applause.mp3'
import cheer2 from '@/game/assets/2yay.mp3'
import cheer3 from '@/game/assets/3yay.mp3'
import cheer4 from '@/game/assets/4-clap.mp3'
import soundtrack from '@/game/assets/AntSurvila_-_RUN.mp3'
import boo1  from '@/game/assets/1boo.mp3'
import boo2  from '@/game/assets/2boo.mp3'

export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    this.load.image('sky', sky)
    // this.load.image('bomb', bomb)
    this.load.atlas('flares', 'https://labs.phaser.io/assets/particles/flares.png', 'https://labs.phaser.io/assets/particles/flares.json')
    // this.load.image('paddle', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png')
    // this.load.audio('thud', [thudMp3, thudOgg])
    this.load.audio('pong', pong)
    this.load.crossOrigin = 'anonymous';
    this.load.image('wall', wall);
    this.load.image('ball', ball);
    this.load.audio('cheer1', cheer1);
    this.load.audio('cheer2', cheer2);
    this.load.audio('cheer3', cheer3);
    this.load.audio('cheer4', cheer4);
    this.load.audio('boo1', boo1);
    this.load.audio('boo2', boo2);
    this.load.audio('soundtrack', soundtrack);
  }

  create () {
    this.scene.start('PlayScene')
  }
}