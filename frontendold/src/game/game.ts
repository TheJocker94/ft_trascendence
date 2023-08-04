import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import ChooseScene from '@/game/scenes/ChooseScene'
import PowerupScene from '@/game/scenes/PowerupScene'
import EndScene from './scenes/EndScene'

function launch(containerId: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	physics: {
      default: 'arcade',
      arcade: {
      gravity: { y: 0 },
      debug: false,
      }
    },
    scene: [BootScene, ChooseScene, PowerupScene, PlayScene, EndScene]
  })
}

export default launch
export { launch }