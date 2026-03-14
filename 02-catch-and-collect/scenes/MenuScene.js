class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        createGameTextures(this);

        // Background
        drawGradientSky(this);
        drawClouds(this, [
            { x: 60, y: 100 },
            { x: 280, y: 60 },
            { x: 160, y: 140 }
        ]);

        // Title
        UIHelper.createTitle(this, 190, 180, 'HOOP', {
            fontSize: '72px', fill: '#FFF', stroke: '#D35400', strokeThickness: 8
        });
        UIHelper.createTitle(this, 190, 255, 'HUSTLE', {
            fontSize: '72px', fill: '#FFD700', stroke: '#D35400', strokeThickness: 8
        });

        // Subtitle
        UIHelper.createLabel(this, 190, 330, 'Catch balls, dodge bombs, survive the rounds!', {
            fontSize: '14px', fill: '#FFF', stroke: '#333', strokeThickness: 3
        });

        // Decorative basketball icon
        this.add.sprite(190, 410, 'basketball').setScale(1.4);

        // Play button
        ButtonHelper.create(this, 190, 500, 'PLAY', 0x27AE60, 0x1E8449, () => {
            this.scene.start('GameScene');
        }, { width: 170, height: 55, fontSize: '32px', radius: 12 });

        // Best score
        const bestScore = localStorage.getItem('bestScore');
        if (bestScore) {
            UIHelper.createLabel(this, 190, 585, `Best Score: ${bestScore}`, {
                fontSize: '22px', fill: '#FFD700', stroke: '#333', strokeThickness: 4
            });
        }

        // Sound toggle
        const soundLabel = sfx.enabled ? 'Sound: ON' : 'Sound: OFF';
        const soundBtn = this.add.text(190, 630, soundLabel, {
            fontSize: '16px',
            fill: sfx.enabled ? '#00FF00' : '#FF4444',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        soundBtn.on('pointerdown', () => {
            const enabled = sfx.toggle();
            soundBtn.setText(enabled ? 'Sound: ON' : 'Sound: OFF');
            soundBtn.setFill(enabled ? '#00FF00' : '#FF4444');
            if (enabled) sfx.click();
        });

        // Footer
        this.add.text(190, 665, 'A Hoop Hustle Game', {
            fontSize: '12px', fill: '#FFFFFF', alpha: 0.6
        }).setOrigin(0.5);
    }
}
