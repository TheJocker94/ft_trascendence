import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import EndScene from './scenes/EndScene'

function launch(containerId: string) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: containerId,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: true,
      }
    },
    scene: [BootScene, PlayScene, EndScene]
  })
}

export default launch
export { launch }