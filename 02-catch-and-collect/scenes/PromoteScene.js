class PromoteScene extends Phaser.Scene {
    constructor() {
        super('PromoteScene');
    }

    create(data) {
        const { score, lives, round } = data;
        const nextRound = round + 1;

        // Background
        drawGradientSky(this);
        drawClouds(this, [{ x: 80, y: 50 }, { x: 260, y: 80 }]);
        drawCard(this, 30, 70, 320, 530);

        // Round Complete title
        UIHelper.createLabel(this, 190, 110, `Round ${round}`, {
            fontSize: '28px', fill: '#FFF', stroke: '#000', strokeThickness: 3
        });
        UIHelper.createTitle(this, 190, 155, 'COMPLETE!', {
            fontSize: '44px', fill: '#00FF00', stroke: '#006600', strokeThickness: 5
        });

        // Current stats
        UIHelper.createTitle(this, 190, 230, `Score: ${score}`, {
            fontSize: '28px', fill: '#FFF', stroke: '#000', strokeThickness: 3
        });
        UIHelper.createLabel(this, 190, 270, `Lives: ${'❤️'.repeat(lives)}`, {
            fontSize: '22px', fill: '#FFF', stroke: '#000', strokeThickness: 2
        });

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xFFFFFF, 0.3);
        divider.lineBetween(60, 310, 320, 310);

        // Next round preview
        UIHelper.createLabel(this, 190, 340, `Round ${nextRound} Preview`, {
            fontSize: '22px', fill: '#FFD700', strokeThickness: 3
        });

        const gravity = 300 + (nextRound - 1) * 150;
        const bombDelay = Math.max(0, 10000 - (nextRound - 1) * 5000);
        const bombWarning = bombDelay === 0 ? 'Bombs from the start!' : `Bombs after ${bombDelay / 1000}s`;

        UIHelper.createLabel(this, 190, 380, `Gravity: ${gravity}  (+150)`, {
            fontSize: '16px', fill: '#FF6347'
        });
        UIHelper.createLabel(this, 190, 410, bombWarning, {
            fontSize: '16px', fill: '#FF6347'
        });

        // Buttons
        ButtonHelper.create(this, 190, 480, 'NEXT ROUND  ▶', 0x27AE60, 0x1E8449, () => {
            this.scene.start('GameScene', { score, lives, round: nextRound });
        });
        ButtonHelper.create(this, 190, 530, 'RESTART', 0xE67E22, 0xD35400, () => {
            this.scene.start('MenuScene');
        });
        ButtonHelper.create(this, 190, 580, 'QUIT', 0xC0392B, 0xA93226, () => {
            this.scene.start('MenuScene');
        });
    }
}
