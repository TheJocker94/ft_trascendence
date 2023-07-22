import { Scene } from 'phaser'

export default class EndScene extends Scene {
    
    constructor () {
        super({ key: 'EndScene' })
    }
    
    init (data: { score1: number, score2: number, winner: string}) {
        this.add.image(400, 300, 'sky')
        this.add.text(400, 300, `${data.winner} wins!`, { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5)
        this.add.text(400, 350, 'Press SPACE to restart', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5)
    }
    
    create () {
        if (this.input.keyboard)
        {
        this.input.keyboard!.once('keydown-SPACE', () => {
        this.scene.start('PlayScene')
        })
        }
    }
    }