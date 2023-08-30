import Phaser from 'phaser'
import BootScene from '@/game/scenes/BootScene'
import PlayScene from '@/game/scenes/PlayScene'
import ChooseScene from '@/game/scenes/ChooseScene'
import PowerupScene from '@/game/scenes/PowerupScene'
import EndScene from './scenes/EndScene'

function launch(containerId: string) {
  const gameInstance = new Phaser.Game({
    type: Phaser.CANVAS,
    scale: {
      parent: containerId,
      mode: Phaser.Scale.FIT,
      width: 800,
      height: 600,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false,
      }
    },
    scene: [BootScene, ChooseScene, PowerupScene, PlayScene, EndScene]
  });

	resizeGame(gameInstance);
	return gameInstance;
}

function resizeGame(gameInstance: Phaser.Game) {
  const canvas = gameInstance.canvas;
  const windowRatio = 800 / 600;
  const gameRatio = gameInstance.config.width as number / (gameInstance.config.height as number);

  if (windowRatio < gameRatio) {
    canvas.style.width = 800 + 'px';
    canvas.style.height = (800 / gameRatio) + 'px';
  } else {
    canvas.style.width = (600 * gameRatio) + 'px';
    canvas.style.height = 600 + 'px';
  }
}

export default launch;
export { launch, resizeGame };
