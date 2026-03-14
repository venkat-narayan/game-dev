// HUD and UI element creator
// Manages score, timer, lives, round display

class UIHelper {
    static createHUD(scene, score, lives, round) {
        // Dark bar behind HUD for readability
        const bar = scene.add.graphics();
        bar.fillStyle(0x000000, 0.4);
        bar.fillRect(0, 0, 380, 80);

        const textStyle = { fontSize: '22px', fill: '#FFF', fontStyle: 'bold', stroke: '#000', strokeThickness: 3 };

        const scoreText = scene.add.text(15, 12, `Score: ${score}`, textStyle);
        const timerText = scene.add.text(190, 12, '60s', textStyle).setOrigin(0.5, 0);
        const livesText = scene.add.text(365, 12, '❤️'.repeat(lives), textStyle).setOrigin(1, 0);
        const roundText = scene.add.text(190, 45, `Round ${round}`, {
            fontSize: '16px', fill: '#FFD700', fontStyle: 'bold', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5, 0);

        return { scoreText, timerText, livesText, roundText };
    }

    static createTitle(scene, x, y, text, options = {}) {
        return scene.add.text(x, y, text, {
            fontSize: options.fontSize || '48px',
            fill: options.fill || '#FFF',
            fontStyle: 'bold',
            stroke: options.stroke || '#000',
            strokeThickness: options.strokeThickness || 6
        }).setOrigin(0.5);
    }

    static createLabel(scene, x, y, text, options = {}) {
        return scene.add.text(x, y, text, {
            fontSize: options.fontSize || '20px',
            fill: options.fill || '#FFF',
            stroke: options.stroke || '#000',
            strokeThickness: options.strokeThickness || 2
        }).setOrigin(0.5);
    }
}
