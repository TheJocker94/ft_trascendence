import { Scene } from 'phaser'
import { socketGame } from '@/plugins/Socket.io';
import { ref } from 'vue';
import { useCurrentUserStore } from '@/stores/currentUser';
import sky from '@/game/assets/sky.png'
import matrix from '@/game/assets/matrix.webp'
import pong from '@/game/assets/pong.mp3'
import thudMp3 from '@/game/assets/thud.mp3'
import thudOgg from '@/game/assets/thud.ogg'
import speed from '@/game/assets/speed.png'
import big from '@/game/assets/big.png'
import small from '@/game/assets/small.png'
import wall from '@/game/assets/wall.png'
import ball from '@/game/assets/ball.png'
import cheer1 from '@/game/assets/cheer1.mp3'
import cheer2 from '@/game/assets/2yay.mp3'
import cheer3 from '@/game/assets/3yay.mp3'
import cheer4 from '@/game/assets/4-clap.mp3'
import soundtrack from '@/game/assets/background.mp3'
import boo1  from '@/game/assets/1boo.mp3'
import boo2  from '@/game/assets/2boo.mp3'
import lefthand from '@/game/assets/lefthand.png'
import righthand from '@/game/assets/righthand.png'
import boom from '@/game/assets/explosion.png'
import chooseSound from '@/game/assets/choose-pill.mp3'
import endgamesoundwin from '@/game/assets/endgamesoundwin.mp3'
import endgamesoundlose from '@/game/assets/endgamesoundlose.mp3'

import lee1 from '@/game/assets/suonisp/lee1.mp3'
import lee2 from '@/game/assets/suonisp/lee2.mp3'
import lee3 from '@/game/assets/suonisp/lee3.mp3'
import lee4 from '@/game/assets/suonisp/lee4.mp3'
import lee5 from '@/game/assets/suonisp/lee5.mp3'
import lee6 from '@/game/assets/suonisp/lee6.mp3'
import nizz1 from '@/game/assets/suonisp/nizz1.mp3'
import nizz2 from '@/game/assets/suonisp/nizz2.mp3'
import nizz3 from '@/game/assets/suonisp/nizz3.mp3'
import nizz4 from '@/game/assets/suonisp/nizz4.mp3'
import nizz5 from '@/game/assets/suonisp/nizz5.mp3'

const userStore = ref(useCurrentUserStore());
// let start1 = false;
// let start2 = false;
let fullyLoaded = 0;
let players = 0;
export default class BootScene extends Scene {
  constructor () {
    super({ key: 'BootScene' })
  }

  preload () {
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
            font: '20px monospace',
            color: '#ffffff'
        }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    const percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
            font: '18px monospace',
            color: '#ffffff'
        }
    });
    percentText.setOrigin(0.5, 0.5);
            
    const assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
            font: '18px monospace',
            color: '#ffffff'
        }
    });
    assetText.setOrigin(0.5, 0.5);
    
    
    console.log('BootScene avviata')
    this.load.audio('lee1', lee1);
    this.load.audio('lee2', lee2);
    this.load.audio('lee3', lee3);
    this.load.audio('lee4', lee4);
    this.load.audio('lee5', lee5);
    this.load.audio('lee6', lee6);
    this.load.audio('nizz1', nizz1);
    this.load.audio('nizz2', nizz2);
    this.load.audio('nizz3', nizz3);
    this.load.audio('nizz4', nizz4);
    this.load.audio('nizz5', nizz5);

    this.load.audio('endgamesoundwin', endgamesoundwin);
    this.load.audio('endgamesoundlose', endgamesoundlose);
    this.load.audio('cheer', cheer1);
    this.load.audio('chooseSound', chooseSound);
    this.load.image('sky', sky)
    this.load.image('matrix', matrix)
    // this.load.image('bomb', bomb)
    this.load.atlas('flares', 'https://labs.phaser.io/assets/particles/flares.png', 'https://labs.phaser.io/assets/particles/flares.json')
    // this.load.image('paddle', 'https://content.codecademy.com/courses/learn-phaser/Codey%20Tundra/codey.png')
    this.load.audio('thud', [thudMp3, thudOgg])
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
    this.load.image('lefthand', lefthand);
    this.load.image('righthand', righthand);
    this.load.image('speed', speed);
    this.load.image('big', big);
    this.load.image('small', small);
    this.load.spritesheet('boom', boom, { frameWidth: 64, frameHeight: 64, endFrame: 23 });
    this.load.on('progress', function (value: string) {
      percentText.setText((parseInt(value) * 100) + '%');
      progressBar.clear();
      // color dark green is 0x2ecc71
      progressBar.fillStyle(0x2ecc71, 1);
      progressBar.fillRect(250, 280, 300 * parseInt(value), 30);
  });
  
  this.load.on('fileprogress', function (file: any) {
      assetText.setText('Loading asset: ' + file.key);
  });
  this.load.on('complete', function () {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
      assetText.destroy();
      fullyLoaded++;
      socketGame.emit('ready', { player: userStore.value.playerNo ,room:userStore.value.roomId})
      console.log('All assets loaded');
  });
    console.log('BootScene avviata dopo')
  }
  
  init () {
}
create () {
    socketGame.on('start', (playerNo) => {
        console.log('start', playerNo)
        players++;
        this.add.image(400, 300, 'matrix')
        this.add.text(400, 150, 'Waiting for both players ...', { stroke: '#000000', strokeThickness: 4, fontSize: '35px', color: '#ffffff', fontFamily: 'Arial' }).setOrigin(0.5)
        if (players === 2 && fullyLoaded === 2){
            socketGame.off('start');
            console.log('start game with both players')
            players = 0;
            fullyLoaded = 0;
            this.scene.start('ChooseScene')
        }
    })
    
    this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('boom', { start: 0, end: 23 }),
        frameRate: 20,
        repeat: 0,
        hideOnComplete: true
    });
    // this.add.image(400, 300, 'matrix')
    // this.add.text(400, 150, 'Waiting for both players ...', { stroke: '#000000', strokeThickness: 4, fontSize: '35px', color: '#ffffff', fontFamily: 'Arial' }).setOrigin(0.5)
    // this.scene.start('PlayScene')
	this.scene.start('ChooseScene')
  }
}
