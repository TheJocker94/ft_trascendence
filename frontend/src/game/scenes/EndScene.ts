import { Scene } from 'phaser'
import { socketGame } from '@/plugins/Socket.io';
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref } from 'vue';

const userStore = ref(useCurrentUserStore());
const restart1 = ref(false);
const restart2 = ref(false);
export default class EndScene extends Scene {
	private win!: Phaser.Sound.BaseSound;
	private lose!: Phaser.Sound.BaseSound;
	private flag!: boolean;
	private waitText!: Phaser.GameObjects.Text;
	private endgame!: Phaser.GameObjects.Text;
    private winnerName!: string;
    constructor () {
        super({ key: 'EndScene' })
    }
    
	init (data: { score1: number, score2: number, winner: string}) {
		if (data.winner == 'Player 1'){
			this.flag = true;
			this.winnerName = userStore.value.username1;
		}
		else{
			this.winnerName = userStore.value.username2;
			this.flag = false;
		}
        this.add.image(400, 300, 'matrix')
        this.add.text(400, 250, `${this.winnerName} won!`, { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
        this.waitText = this.add.text(400, 350, 'Press SPACE to restart', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
        this.endgame = this.add.text(400, 450, 'Press ESC to exit', { stroke: '#000000', strokeThickness: 4, fontSize: '32px', fontFamily: 'Arial', color: '#ffffff', fontStyle: 'bold italic' }).setOrigin(0.5)
    }
    
    create () {
		this.win = this.sound.add('endgamesoundwin');
		this.lose = this.sound.add('endgamesoundlose');
		
		socketGame.on('restartServer', (playerNo) => {
			if(playerNo == 1)
				restart1.value = true;
			else
				restart2.value = true;
			if (restart1.value && restart2.value){
				socketGame.off('restartServer');
				restart1.value = false;
				restart2.value = false;
				this.win.stop();
				this.lose.stop();
				this.scene.start('ChooseScene')
			}
		})
		if (this.flag)
			this.win.play();
		else
			this.lose.play();
		if (this.input.keyboard)
        {
			this.input.keyboard!.once('keydown-SPACE', () => {
				socketGame.emit('restart', { player: userStore.value.playerNo ,room:userStore.value.roomId});
				this.waitText.setText('Waiting for other player to restart...');
			})
			this.input.keyboard!.once('keydown-ESC', () => {
				this.win.stop();
				this.lose.stop();
				socketGame.off('restartServer');
				socketGame.emit('exitGame', userStore.value.roomId);
			})

        }
    }
    }
