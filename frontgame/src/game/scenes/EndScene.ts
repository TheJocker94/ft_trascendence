import { Scene } from 'phaser'

export default class EndScene extends Scene {
    
    constructor () {
        super({ key: 'EndScene' })
    }
    
    init (data: any) {
        console.log(data)
        this.add.text(400, 300, `${data.winner} wins!`, { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5)
        console.log(data.winner)
    }
    
    create () {
        this.add.text(400, 350, 'Press SPACE to restart', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5)
        if (this.input.keyboard)
        {
        this.input.keyboard!.once('keydown-SPACE', () => {
        this.scene.start('PlayScene')
        })
        }
    }
    }