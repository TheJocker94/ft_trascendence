import { Scene } from 'phaser'

export default class ChooseScene extends Scene {
	private lefthand!: Phaser.GameObjects.Image;
	private righthand!: Phaser.GameObjects.Image;
	private chooseSound!: Phaser.Sound.BaseSound;
    
    constructor () {
        super({ key: 'ChooseScene' })
    }
    init () {
		this.add.image(400, 300, 'matrix')
        this.add.text(400, 150, 'Choose Your Pill', { stroke: '#000000', strokeThickness: 4, fontSize: '35px', color: '#ffffff', fontFamily: 'Arial' }).setOrigin(0.5)
    }
    
    create () {
		this.chooseSound = this.sound.add('chooseSound');
		this.chooseSound.play();
		this.lefthand = this.add.image(200, 350, 'lefthand').setScale(0.5);
		this.lefthand.setInteractive();
		this.lefthand.on('pointerdown', () => {
			console.log('lefthand clicked!');
			this.chooseSound.stop();
			this.scene.start('PlayScene');
		});

		this.righthand = this.add.image(600, 350, 'righthand').setScale(0.5);
		this.righthand.setInteractive();
		this.righthand.on('pointerdown', () => {
			console.log('righthand clicked!')
			this.chooseSound.stop();
			this.scene.start('PowerupScene');
		});
		this.righthand.on('pointerover', () => {
            this.game.canvas.style.cursor = 'pointer';
        });

        this.righthand.on('pointerout', () => {
            this.game.canvas.style.cursor = 'default';
        });

		this.lefthand.on('pointerover', () => {
            this.game.canvas.style.cursor = 'pointer';
        });

        this.lefthand.on('pointerout', () => {
            this.game.canvas.style.cursor = 'default';
        });
        // let button: Phaser.GameObjects.Image = this.add.image(400, 300, 'button').setScale(1);
        // button.setInteractive();
		// button.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        //     let localX = pointer.x - button.x + button.width * 0.5;  // adjust for the center anchor point
        //     let localY = pointer.y - button.y + button.height * 0.5;
            
        //     // Now you can check whether the pointer is within your desired button region
        //     if (localX >= 300 && localX < 350 && localY >= 200 && localY < 250) {
        //         console.log('Button region clicked!');
        //     }
        // });
    }
	// update() {
    //     let pointer = this.input.activePointer;
    //     let localX = pointer.x - this.button.x + this.button.width * 0.5;
    //     let localY = pointer.y - this.button.y + this.button.height * 0.5;
        
    //     // Check whether the pointer is within your desired button region
    //     if (localX >= 300 && localX < 350 && localY >= 200 && localY < 250) {
    //         this.game.canvas.style.cursor = 'pointer';
    //     } else {
    //         this.game.canvas.style.cursor = 'default';
    //     }
    // }
    }