import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import ChooseScene from '@/game/scenes/ChooseScene'
import PowerupScene from '@/game/scenes/PowerupScene'
import EndScene from './scenes/EndScene'

function launch(containerId: string) {
  return new Phaser.Game({
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: containerId,
	// scale: {
  //       mode: Phaser.Scale.MAX_ZOOM,
  //       autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  //   },
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.ENVELOP,
    // mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    // mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    // mode: Phaser.Scale.RESIZE,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    // zoom: Phaser.Scale.NO_ZOOM,
    // zoom: Phaser.Scale.MAX_ZOOM,
    parent: containerId,
    fullscreenTarget: containerId
  },
	physics: {
      default: 'arcade',
      arcade: {
      gravity: { y: 0 },
      debug: true,
      }
    },
    scene: [BootScene, ChooseScene, PowerupScene, PlayScene, EndScene]
  })
}

export default launch
export { launch }