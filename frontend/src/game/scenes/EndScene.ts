import { Scene } from 'phaser'

export default class EndScene extends Scene {
    
    constructor () {
        super({ key: 'EndScene' })
    }
    
    init (data: { score1: number, score2: number, winner: string}) {
        this.add.image(400, 300, 'matrix')
        this.add.text(400, 250, `${data.winner} wins!`, { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
        this.add.text(400, 350, 'Press SPACE to restart', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
    }
    
    create () {
        if (this.input.keyboard)
        {
        this.input.keyboard!.once('keydown-SPACE', () => {
        this.scene.start('ChooseScene')
        })
        }
    }
    }