class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    create(data) {
        const { score, round, timeSurvived, bestScore } = data;

        // Background
        drawDarkBackground(this);
        drawCard(this, 30, 70, 320, 510);

        // Title
        UIHelper.createTitle(this, 190, 130, 'GAME OVER', {
            fontSize: '48px', fill: '#FF4444', stroke: '#000', strokeThickness: 6
        });

        // Stats
        UIHelper.createTitle(this, 190, 225, `Final Score: ${score}`, {
            fontSize: '30px', fill: '#FFF', stroke: '#000', strokeThickness: 4
        });
        UIHelper.createLabel(this, 190, 275, `Best Score: ${bestScore}`, {
            fontSize: '24px', fill: '#FFD700', strokeThickness: 3
        });

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xFFFFFF, 0.3);
        divider.lineBetween(60, 310, 320, 310);

        UIHelper.createLabel(this, 190, 340, `Round Reached: ${round}`, {
            fontSize: '22px', fill: '#00CCFF', strokeThickness: 3
        });
        UIHelper.createLabel(this, 190, 375, `Time Survived: ${timeSurvived}s`, {
            fontSize: '18px', fill: '#AAAAAA'
        });

        // New best score celebration
        if (score >= bestScore && score > 0) {
            UIHelper.createTitle(this, 190, 435, 'NEW BEST SCORE!', {
                fontSize: '28px', fill: '#00FF00', stroke: '#006600', strokeThickness: 4
            });
        }

        // Restart button
        ButtonHelper.create(this, 190, 530, 'TRY AGAIN', 0x27AE60, 0x1E8449, () => {
            this.scene.start('MenuScene');
        }, { width: 200, height: 45, fontSize: '24px', radius: 10 });
    }
}
