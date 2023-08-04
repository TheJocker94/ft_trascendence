import { Scene } from 'phaser'

export default class EndScene extends Scene {
	private win!: Phaser.Sound.BaseSound;
	private lose!: Phaser.Sound.BaseSound;
	private flag!: boolean;
    
    constructor () {
        super({ key: 'EndScene' })
    }
    
	init (data: { score1: number, score2: number, winner: string}) {
		if (data.winner == 'Player 1')
			this.flag = true;
		else
			this.flag = false;
        this.add.image(400, 300, 'matrix')
        this.add.text(400, 250, `${data.winner} wins!`, { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
        this.add.text(400, 350, 'Press SPACE to restart', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
    }
    
    create () {
		this.win = this.sound.add('endgamesoundwin');
		this.lose = this.sound.add('endgamesoundlose');
		if (this.flag)
			this.win.play();
		else
			this.lose.play();
        if (this.input.keyboard)
        {
			this.input.keyboard!.once('keydown-SPACE', () => {
				this.win.stop();
				this.lose.stop();
				this.scene.start('ChooseScene')
		})
        }
    }
    }